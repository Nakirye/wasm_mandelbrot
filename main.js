import { mandelbrotJS } from "./js/mandelbrot.js";
import { measure, countDiffs, wasmImports, PRESETS } from "./js/bench-utils.js";

const $ = (id) => document.getElementById(id);

// 1. Wasm-Modul laden
const { instance } = await WebAssembly.instantiateStreaming(
  fetch("build/release.wasm"),
  wasmImports,
);
const wasm = instance.exports;

// Ausschnitte ins Dropdown eintragen
for (const [key, p] of Object.entries(PRESETS)) {
  $("preset").add(new Option(p.label, key));
}
$("status").textContent = "Bereit.";
$("run").addEventListener("click", runBenchmark);

async function runBenchmark() {
  const width = +$("width").value;
  const height = +$("height").value;
  const maxIter = +$("maxIter").value;
  const runs = +$("runs").value;
  const { cx, cy, zoom } = PRESETS[$("preset").value];

  $("run").disabled = true;
  $("status").textContent = "Messe … (das Fenster kann kurz hängen)";
  await nextFrame(); // Browser die Statusmeldung anzeigen lassen

  // 2. JavaScript: Pixel landen in einem normalen Uint32Array
  const jsPixels = new Uint32Array(width * height);
  const jsTime = measure(
    () => mandelbrotJS(jsPixels, width, height, maxIter, cx, cy, zoom), runs);

  await nextFrame();

  // 3. Wasm: Pixel landen im Wasm-Speicher.
  //    Die Sicht (Uint32Array) erst NACH allocBuffer erzeugen,
  //    weil der Speicher dabei wachsen kann.
  const ptr = wasm.allocBuffer(width, height);
  const wasmPixels = new Uint32Array(wasm.memory.buffer, ptr, width * height);
  const wasmTime = measure(
    () => wasm.mandelbrot(width, height, maxIter, cx, cy, zoom), runs);

  // 4. Ergebnisse anzeigen
  draw($("canvasJs"), jsPixels, width, height);
  draw($("canvasWasm"), wasmPixels, width, height);

  const speedup = jsTime.median / wasmTime.median;
  const diffs = countDiffs(jsPixels, wasmPixels);

  $("results").innerHTML = `
    <tr><td>JavaScript</td><td>${jsTime.median.toFixed(1)} ms</td><td>${jsTime.min.toFixed(1)} ms</td></tr>
    <tr><td>WebAssembly</td><td>${wasmTime.median.toFixed(1)} ms</td><td>${wasmTime.min.toFixed(1)} ms</td></tr>
    <tr><td>Faktor (JS / Wasm)</td><td colspan="2">${speedup.toFixed(2)}×</td></tr>
    <tr><td>Abweichende Pixel</td><td colspan="2">${diffs}</td></tr>`;

  $("status").textContent = diffs === 0
    ? "Fertig. Beide Bilder sind pixelgenau identisch."
    : `Fertig, aber ${diffs} Pixel unterscheiden sich.`;
  $("run").disabled = false;
}

function draw(canvas, pixels, width, height) {
  canvas.width = width;
  canvas.height = height;
  const bytes = new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, width * height * 4);
  canvas.getContext("2d").putImageData(new ImageData(bytes, width, height), 0, 0);
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
}
