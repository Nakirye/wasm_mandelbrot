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

// Colour from the number of iterations.
// Result as 0xAABBGGRR, so the bytes in memory read R, G, B, A.
@inline
function color(i: i32, maxIter: i32): u32 {
  if (i >= maxIter) return 0xFF000000; // in the set: black
  const t = Math.sqrt(<f64>i / <f64>maxIter); // square root: brighter colours near the edge
  const s = 1.0 - t;
  const r = <u32>(9.0 * s * t * t * t * 255.0);
  const g = <u32>(15.0 * s * s * t * t * 255.0);
  const b = <u32>(8.5 * s * s * s * t * 255.0);
  return 0xFF000000 | (b << 16) | (g << 8) | r;
}
