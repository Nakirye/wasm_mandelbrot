// Mandelbrot in JavaScript
// ------------------------
// Deliberately identical to assembly/index.ts line by line,
// so the comparison is fair.

export function mandelbrotJS(pixels, width, height, maxIter, centerX, centerY, zoom) {
  const scale = 3.0 / (height * zoom);
  const halfW = width / 2.0;
  const halfH = height / 2.0;
  let idx = 0;

  for (let py = 0; py < height; py++) {
    const cy = centerY + (py - halfH) * scale;

    for (let px = 0; px < width; px++) {
      const cx = centerX + (px - halfW) * scale;

      // z <- z² + c, while |z| <= 2 and maxIter not reached
      let x = 0.0;
      let y = 0.0;
      let i = 0;
      while (x * x + y * y <= 4.0 && i < maxIter) {
        const xNew = x * x - y * y + cx;
        y = 2.0 * x * y + cy;
        x = xNew;
        i++;
      }

      pixels[idx++] = color(i, maxIter);
    }
  }
}

// Colour gradient from the Kanagawa palette: sumiInk0, waveBlue1, waveBlue2,
// crystalBlue, fujiWhite, carpYellow (same values in assembly/index.ts)
const STOP_R = [22, 34, 45, 126, 220, 230];
const STOP_G = [22, 50, 79, 156, 215, 195];
const STOP_B = [29, 73, 103, 216, 186, 132];

function color(i, maxIter) {
  if (i >= maxIter) return 0xFF1D1616; // in the set: sumiInk0 (#16161D)
  // fourth root: spreads the colours, so the outer area is not too dark
  const t = Math.sqrt(Math.sqrt(i / maxIter));
  // position in the gradient: between stop k and stop k + 1
  const pos = t * 5.0;
  const k = pos | 0;
  const f = pos - k;
  const r = (STOP_R[k] + (STOP_R[k + 1] - STOP_R[k]) * f) | 0;
  const g = (STOP_G[k] + (STOP_G[k + 1] - STOP_G[k]) * f) | 0;
  const b = (STOP_B[k] + (STOP_B[k + 1] - STOP_B[k]) * f) | 0;
  return 0xFF000000 | (b << 16) | (g << 8) | r;
}
