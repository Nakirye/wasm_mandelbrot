// Cold start: npm run bench:cold
// Measures the very FIRST call of each variant, without warm-up.
// Every measurement runs in a fresh Node process, so nothing is cached
// or already compiled.
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mandelbrotJS } from "./js/mandelbrot.js";
import { wasmImports } from "./js/bench-utils.js";

const WIDTH = 800;
const HEIGHT = 600;
const MAX_ITER = 1000;
const REPEATS = 5;
const VARIANTS = ["js", "wasm", "simd"];

const variant = process.argv[2];

if (variant) {
  // Child process: measure one first call and print the time
  let render;
  if (variant === "js") {
    const pixels = new Uint32Array(WIDTH * HEIGHT);
    render = () => mandelbrotJS(pixels, WIDTH, HEIGHT, MAX_ITER, -0.5, 0, 1);
  } else {
    const bytes = await readFile(new URL("./build/release.wasm", import.meta.url));
    const { instance } = await WebAssembly.instantiate(bytes, wasmImports);
    const wasm = instance.exports;
    wasm.allocBuffer(WIDTH, HEIGHT);
    const fn = variant === "simd" ? wasm.mandelbrotSimd : wasm.mandelbrot;
    render = () => fn(WIDTH, HEIGHT, MAX_ITER, -0.5, 0, 1);
  }

  const first = timed(render);
  const second = timed(render);
  console.log(JSON.stringify({ first, second }));
} else {
  // Parent process: start a fresh process per measurement
  console.log(`Cold start ${WIDTH}x${HEIGHT}, ${MAX_ITER} iterations, ` +
              `median of ${REPEATS} fresh processes\n`);
  const script = fileURLToPath(import.meta.url);
  const names = { js: "JavaScript", wasm: "Wasm", simd: "Wasm SIMD" };
  const rows = [];

  for (const v of VARIANTS) {
    const runs = [];
    for (let i = 0; i < REPEATS; i++) {
      runs.push(JSON.parse(execFileSync(process.execPath, [script, v], { encoding: "utf8" })));
    }
    rows.push({
      Variant: names[v],
      "1st call (ms)": +median(runs.map((r) => r.first)).toFixed(1),
      "2nd call (ms)": +median(runs.map((r) => r.second)).toFixed(1),
    });
  }
  console.table(rows);
}

function timed(fn) {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
}

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
