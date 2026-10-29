// Mandelbrot in AssemblyScript
// ----------------------------
// The pixels go directly into WebAssembly's linear memory.
// JavaScript reads them from there without copying (see main.js).

let buffer: usize = 0;   // address of the pixel buffer in Wasm memory
let capacity: i32 = 0;   // current size of the buffer in bytes

// Reserves memory for width * height pixels (4 bytes each: R, G, B, A)
// and returns the address. Important: if memory grows in the process,
// JavaScript must recreate its view of memory.buffer.
export function allocBuffer(width: i32, height: i32): usize {
  const size = width * height * 4;
  if (size > capacity) {
    buffer = heap.alloc(<usize>size);
    capacity = size;
  }
  return buffer;
}

// Computes the Mandelbrot image into the buffer.
// centerX/centerY: image centre, zoom: 1 = whole set visible
export function mandelbrot(width: i32, height: i32, maxIter: i32,
                           centerX: f64, centerY: f64, zoom: f64): void {
  const scale = 3.0 / (<f64>height * zoom);
  const halfW = <f64>width / 2.0;
  const halfH = <f64>height / 2.0;
  let ptr = buffer;

  for (let py: i32 = 0; py < height; py++) {
    const cy = centerY + (<f64>py - halfH) * scale;

    for (let px: i32 = 0; px < width; px++) {
      const cx = centerX + (<f64>px - halfW) * scale;

      // z <- z² + c, while |z| <= 2 and maxIter not reached
      let x = 0.0;
      let y = 0.0;
      let i: i32 = 0;
      while (x * x + y * y <= 4.0 && i < maxIter) {
        const xNew = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = xNew;
        i++;
      }

      store<u32>(ptr, color(i, maxIter));
      ptr += 4;
    }
  }
}

// Colour gradient from the Kanagawa palette: sumiInk0, waveBlue1, waveBlue2,
// crystalBlue, fujiWhite, carpYellow (same values in js/mandelbrot.js)
const STOP_R: StaticArray<f64> = [22, 34, 45, 126, 220, 230];
const STOP_G: StaticArray<f64> = [22, 50, 79, 156, 215, 195];
const STOP_B: StaticArray<f64> = [29, 73, 103, 216, 186, 132];

// Colour from the number of iterations.
// Result as 0xAABBGGRR, so the bytes in memory read R, G, B, A.
@inline
function color(i: i32, maxIter: i32): u32 {
  if (i >= maxIter) return 0xFF1D1616; // in the set: sumiInk0 (#16161D)
  // fourth root: spreads the colours, so the outer area is not too dark
  const t = Math.sqrt(Math.sqrt(<f64>i / <f64>maxIter));
  // position in the gradient: between stop k and stop k + 1
  const pos = t * 5.0;
  const k = <i32>pos;
  const f = pos - <f64>k;
  const r = <u32>(STOP_R[k] + (STOP_R[k + 1] - STOP_R[k]) * f);
  const g = <u32>(STOP_G[k] + (STOP_G[k + 1] - STOP_G[k]) * f);
  const b = <u32>(STOP_B[k] + (STOP_B[k + 1] - STOP_B[k]) * f);
  return 0xFF000000 | (b << 16) | (g << 8) | r;
}

// SIMD variant: computes 2 neighbouring pixels at once (f64x2).
// Same f64 operations per lane as above, so the image is identical.
// JavaScript has no SIMD, so this is something only Wasm can do.
export function mandelbrotSimd(width: i32, height: i32, maxIter: i32,
                               centerX: f64, centerY: f64, zoom: f64): void {
  const scale = 3.0 / (<f64>height * zoom);
  const halfW = <f64>width / 2.0;
  const halfH = <f64>height / 2.0;
  const four = f64x2.splat(4.0);
  const two = f64x2.splat(2.0);
  let ptr = buffer;

  for (let py: i32 = 0; py < height; py++) {
    const cy = f64x2.splat(centerY + (<f64>py - halfH) * scale);

    let px: i32 = 0;
    for (; px + 1 < width; px += 2) {
      let cx = f64x2.splat(0);
      cx = f64x2.replace_lane(cx, 0, centerX + (<f64>px - halfW) * scale);
      cx = f64x2.replace_lane(cx, 1, centerX + (<f64>(px + 1) - halfW) * scale);

      let x = f64x2.splat(0.0);
      let y = f64x2.splat(0.0);
      let iters = i64x2.splat(0);
      // active: all bits set in the lanes that have not escaped yet
      let active = i64x2.splat(-1);

      for (let n: i32 = 0; n < maxIter; n++) {
        const xx = f64x2.mul(x, x);
        const yy = f64x2.mul(y, y);
        active = v128.and(active, f64x2.le(f64x2.add(xx, yy), four));
        if (!v128.any_true(active)) break;
        iters = i64x2.sub(iters, active); // active lane = -1, so this adds 1
        const xNew = f64x2.add(f64x2.sub(xx, yy), cx);
        y = f64x2.add(f64x2.mul(f64x2.mul(two, x), y), cy);
        x = xNew;
      }

      store<u32>(ptr, color(<i32>i64x2.extract_lane(iters, 0), maxIter));
      store<u32>(ptr + 4, color(<i32>i64x2.extract_lane(iters, 1), maxIter));
      ptr += 8;
    }

    // odd width: last pixel without SIMD
    if (px < width) {
      const cx = centerX + (<f64>px - halfW) * scale;
      const cys = f64x2.extract_lane(cy, 0);
      let x = 0.0;
      let y = 0.0;
      let i: i32 = 0;
      while (x * x + y * y <= 4.0 && i < maxIter) {
        const xNew = x * x - y * y + cx;
        y = 2.0 * x * y + cys;
        x = xNew;
        i++;
      }
      store<u32>(ptr, color(i, maxIter));
      ptr += 4;
    }
  }
}
