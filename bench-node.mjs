// Benchmark in the terminal: npm run bench
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

console.log(`Mandelbrot ${WIDTH}x${HEIGHT}, ${RUNS} runs per entry (median)\n`);

const rows = [];
for (const maxIter of [100, 500, 1000, 3000]) {
  const js = measure(() => mandelbrotJS(jsPixels, WIDTH, HEIGHT, maxIter, cx, cy, zoom), RUNS);
  const wa = measure(() => wasm.mandelbrot(WIDTH, HEIGHT, maxIter, cx, cy, zoom), RUNS);
  const diffsWasm = countDiffs(jsPixels, wasmPixels);
  // the SIMD variant writes into the same Wasm buffer
  const simd = measure(() => wasm.mandelbrotSimd(WIDTH, HEIGHT, maxIter, cx, cy, zoom), RUNS);
  const diffsSimd = countDiffs(jsPixels, wasmPixels);

  rows.push({
    "Max. iter.": maxIter,
    "JS (ms)": +js.median.toFixed(1),
    "Wasm (ms)": +wa.median.toFixed(1),
    "Wasm SIMD (ms)": +simd.median.toFixed(1),
    "JS/Wasm": +(js.median / wa.median).toFixed(2),
    "JS/SIMD": +(js.median / simd.median).toFixed(2),
    "Differing px": diffsWasm + diffsSimd,
  });
}

console.table(rows);
