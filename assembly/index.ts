// Mandelbrot in AssemblyScript
// ----------------------------
// Die Pixel landen direkt im linearen Speicher von WebAssembly.
// JavaScript liest sie von dort ohne Kopie aus (siehe main.js).

let buffer: usize = 0;   // Adresse des Pixel-Puffers im Wasm-Speicher
let capacity: i32 = 0;   // aktuelle Größe des Puffers in Bytes

// Reserviert Speicher für width * height Pixel (je 4 Bytes: R, G, B, A)
// und gibt die Adresse zurück. Wichtig: Wenn dabei der Speicher wächst,
// muss JavaScript seine Sicht auf memory.buffer neu erzeugen.
export function allocBuffer(width: i32, height: i32): usize {
  const size = width * height * 4;
  if (size > capacity) {
    buffer = heap.alloc(<usize>size);
    capacity = size;
  }
  return buffer;
}

// Berechnet das Mandelbrot-Bild in den Puffer.
// centerX/centerY: Bildmitte, zoom: 1 = ganze Menge sichtbar
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

      // z <- z² + c, solange |z| <= 2 und maxIter nicht erreicht
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

// Farbe aus der Anzahl der Iterationen.
// Ergebnis als 0xAABBGGRR, damit die Bytes im Speicher R, G, B, A ergeben.
@inline
function color(i: i32, maxIter: i32): u32 {
  if (i >= maxIter) return 0xFF000000; // in der Menge: schwarz
  const t = Math.sqrt(<f64>i / <f64>maxIter); // Wurzel: hellere Farben am Rand
  const s = 1.0 - t;
  const r = <u32>(9.0 * s * t * t * t * 255.0);
  const g = <u32>(15.0 * s * s * t * t * 255.0);
  const b = <u32>(8.5 * s * s * s * t * 255.0);
  return 0xFF000000 | (b << 16) | (g << 8) | r;
}
