// Benchmark im Terminal: npm run bench
import { readFile } from "node:fs/promises";
import { mandelbrotJS } from "./js/mandelbrot.js";
import { measure, countDiffs, wasmImports, PRESETS } from "./js/bench-utils.js";

const bytes = await readFile(new URL("./build/release.wasm", import.meta.url));
const { instance } = await WebAssembly.instantiate(bytes, wasmImports);
const wasm = instance.exports;

const WIDTH = 800;
const HEIGHT = 600;
const RUNS = 10;
const { cx, cy, zoom } = PRESETS.overview;

const ptr = wasm.allocBuffer(WIDTH, HEIGHT);
const wasmPixels = new Uint32Array(wasm.memory.buffer, ptr, WIDTH * HEIGHT);
const jsPixels = new Uint32Array(WIDTH * HEIGHT);

console.log(`Mandelbrot ${WIDTH}x${HEIGHT}, ${RUNS} Messläufe pro Eintrag\n`);

const rows = [];
for (const maxIter of [100, 500, 1000, 3000]) {
  const js = measure(() => mandelbrotJS(jsPixels, WIDTH, HEIGHT, maxIter, cx, cy, zoom), RUNS);
  const wa = measure(() => wasm.mandelbrot(WIDTH, HEIGHT, maxIter, cx, cy, zoom), RUNS);

  rows.push({
    "Max. Iterationen": maxIter,
    "JS Median (ms)": +js.median.toFixed(1),
    "Wasm Median (ms)": +wa.median.toFixed(1),
    "Faktor JS/Wasm": +(js.median / wa.median).toFixed(2),
    "Abweichende Pixel": countDiffs(jsPixels, wasmPixels),
  });
}

console.table(rows);
