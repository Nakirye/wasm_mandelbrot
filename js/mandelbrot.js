// Mandelbrot in JavaScript
// ------------------------
// Bewusst Zeile für Zeile gleich wie assembly/index.ts,
// damit der Vergleich fair ist.

export function mandelbrotJS(pixels, width, height, maxIter, centerX, centerY, zoom) {
  const scale = 3.0 / (height * zoom);
  const halfW = width / 2.0;
  const halfH = height / 2.0;
  let idx = 0;

  for (let py = 0; py < height; py++) {
    const cy = centerY + (py - halfH) * scale;

    for (let px = 0; px < width; px++) {
      const cx = centerX + (px - halfW) * scale;

      // z <- z² + c, solange |z| <= 2 und maxIter nicht erreicht
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

function color(i, maxIter) {
  if (i >= maxIter) return 0xFF000000;
  const t = Math.sqrt(i / maxIter); // Wurzel: hellere Farben am Rand
  const s = 1.0 - t;
  const r = (9.0 * s * t * t * t * 255.0) | 0;
  const g = (15.0 * s * s * t * t * 255.0) | 0;
  const b = (8.5 * s * s * s * t * 255.0) | 0;
  return 0xFF000000 | (b << 16) | (g << 8) | r;
}
