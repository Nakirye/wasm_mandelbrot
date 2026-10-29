// Wraps the Wasm fireworks (build/particles.wasm) in the same interface
// as the two JavaScript variants: new …(width, height, target, seed),
// step(), pixels, particleCount.
import { wasmImports } from "./bench-utils.js";

export async function loadWasmFireworks(bytesOrResponse) {
  const { instance } = bytesOrResponse instanceof Response
    ? await WebAssembly.instantiateStreaming(bytesOrResponse, wasmImports)
    : await WebAssembly.instantiate(bytesOrResponse, wasmImports);
  const wasm = instance.exports;

  return class WasmFireworks {
    constructor(width, height, target, seed) {
      const ptr = wasm.init(width, height, target, seed);
      // create the view only AFTER init, memory may have grown
      this.pixels = new Uint32Array(wasm.memory.buffer, ptr, width * height);
    }

    get particleCount() {
      return wasm.particleCount();
    }

    step() {
      wasm.step();
    }
  };
}
