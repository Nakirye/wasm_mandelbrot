// Renders frames for the live zoom page (zoom.html).
// Each variant runs in its own worker, i.e. on its own CPU core,
// so a slow variant cannot hold up the other one.
import { mandelbrotJS } from "./mandelbrot.js";
import { wasmImports } from "./bench-utils.js";

const { instance } = await WebAssembly.instantiateStreaming(
  fetch("../build/release.wasm"),
  wasmImports,
);
const wasm = instance.exports;

// Warm up once, so neither JavaScript nor Wasm is measured
// in its slow start-up tier (see bench-cold.mjs)
const warm = new Uint32Array(64 * 64);
mandelbrotJS(warm, 64, 64, 200, -0.5, 0, 1);
wasm.allocBuffer(64, 64);
wasm.mandelbrot(64, 64, 200, -0.5, 0, 1);
wasm.mandelbrotSimd(64, 64, 200, -0.5, 0, 1);

self.onmessage = ({ data }) => {
  const { engine, width, height, maxIter, cx, cy, zoom } = data;
  let pixels;

  const t0 = performance.now();
  if (engine === "js") {
    pixels = new Uint32Array(width * height);
    mandelbrotJS(pixels, width, height, maxIter, cx, cy, zoom);
  } else {
    const ptr = wasm.allocBuffer(width, height);
    if (engine === "simd") wasm.mandelbrotSimd(width, height, maxIter, cx, cy, zoom);
    else wasm.mandelbrot(width, height, maxIter, cx, cy, zoom);
    // copy out of Wasm memory, the buffer is reused for the next frame
    pixels = new Uint32Array(wasm.memory.buffer, ptr, width * height).slice();
  }
  const ms = performance.now() - t0;

  self.postMessage({ pixels, width, height, ms, zoom }, [pixels.buffer]);
};

self.postMessage({ ready: true });
