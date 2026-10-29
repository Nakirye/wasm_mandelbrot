// Cold start in the browser: every measurement gets a fresh worker.
// A worker has its own JavaScript engine instance, so nothing has been
// compiled or optimised yet when the first call starts.
import { mandelbrotJS } from "./mandelbrot.js";
import { wasmImports } from "./bench-utils.js";

self.onmessage = async ({ data }) => {
  const { variant, width, height, maxIter, cx, cy, zoom } = data;
  let render;
  let pixels;

  if (variant === "js") {
    pixels = new Uint32Array(width * height);
    render = () => mandelbrotJS(pixels, width, height, maxIter, cx, cy, zoom);
  } else {
    // V8 keeps compiled (and already optimised) Wasm code for identical
    // module bytes and shares it between workers. A random custom section
    // makes the bytes unique, so the module really is compiled from scratch.
    const bytes = await (await fetch("../build/release.wasm")).arrayBuffer();
    const { instance } = await WebAssembly.instantiate(withNonce(bytes), wasmImports);
    const wasm = instance.exports;
    const ptr = wasm.allocBuffer(width, height);
    const fn = variant === "simd" ? wasm.mandelbrotSimd : wasm.mandelbrot;
    render = () => fn(width, height, maxIter, cx, cy, zoom);
    pixels = new Uint32Array(wasm.memory.buffer, ptr, width * height);
  }

  const first = timed(render);
  const second = timed(render);
  const copy = pixels.slice();
  self.postMessage({ first, second, pixels: copy }, [copy.buffer]);
};

// Appends a custom section "nonce" with 8 random bytes. Custom sections
// are ignored when running the module, they only change its bytes.
function withNonce(bytes) {
  const name = [...new TextEncoder().encode("nonce")];
  const random = [...crypto.getRandomValues(new Uint8Array(8))];
  const payload = [name.length, ...name, ...random];
  // section id 0 = custom section, then its size (fits in one LEB128 byte)
  const section = new Uint8Array([0, payload.length, ...payload]);

  const result = new Uint8Array(bytes.byteLength + section.length);
  result.set(new Uint8Array(bytes));
  result.set(section, bytes.byteLength);
  return result;
}

function timed(fn) {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
}
