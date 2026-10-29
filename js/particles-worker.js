// Runs one fireworks variant for the live page (particles.html).
// Each variant gets its own worker, i.e. its own CPU core and its own
// garbage collector, so the variants cannot slow each other down.
import { ObjectFireworks } from "./particles-objects.js";
import { TypedFireworks } from "./particles-typed.js";
import { loadWasmFireworks } from "./particles-wasm.js";

const VARIANTS = {
  objects: ObjectFireworks,
  typed: TypedFireworks,
  wasm: await loadWasmFireworks(await fetch("../build/particles.wasm")),
};

let sim = null;

self.onmessage = ({ data }) => {
  if (data.type === "init") {
    const { variant, width, height, target, seed } = data;
    sim = new VARIANTS[variant](width, height, target, seed);
    return;
  }

  // type "step": compute one step and send a copy of the frame
  const t0 = performance.now();
  sim.step();
  const ms = performance.now() - t0;

  const pixels = sim.pixels.slice();
  self.postMessage({ pixels, ms, count: sim.particleCount }, [pixels.buffer]);
};

self.postMessage({ ready: true });
