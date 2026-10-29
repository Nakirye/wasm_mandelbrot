// Fireworks benchmark in the terminal: npm run bench:particles
// (runs with --expose-gc, so it can clean up between the variants)
// Compares JavaScript with objects, JavaScript with typed arrays and Wasm.
import { readFile } from "node:fs/promises";
import { ObjectFireworks } from "./js/particles-objects.js";
import { TypedFireworks } from "./js/particles-typed.js";
import { loadWasmFireworks } from "./js/particles-wasm.js";
import { countDiffs } from "./js/bench-utils.js";

const WasmFireworks = await loadWasmFireworks(
  await readFile(new URL("./build/particles.wasm", import.meta.url)));

const WIDTH = 640;
const HEIGHT = 400;
const SEED = 42;
const WARMUP_STEPS = 180;   // 3 s simulated: fills up to the target count
const MEASURED_STEPS = 600; // 10 s simulated

const VARIANTS = {
  "JS objects": ObjectFireworks,
  "JS typed arrays": TypedFireworks,
  "Wasm": WasmFireworks,
};

console.log(`Fireworks ${WIDTH}x${HEIGHT}, ${MEASURED_STEPS} steps per entry ` +
            `(after ${WARMUP_STEPS} warm-up steps)\n`);

for (const target of [10_000, 100_000, 300_000, 1_000_000]) {
  const rows = [];
  const results = [];

  for (const [name, Fireworks] of Object.entries(VARIANTS)) {
    // clean up the garbage of the previous variant first, so it is not
    // collected (and counted) while the next variant is measured
    global.gc?.();
    const sim = new Fireworks(WIDTH, HEIGHT, target, SEED);
    for (let i = 0; i < WARMUP_STEPS; i++) sim.step();

    const times = [];
    for (let i = 0; i < MEASURED_STEPS; i++) {
      const t0 = performance.now();
      sim.step();
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    results.push({ name, avg, sim });

    rows.push({
      Variant: name,
      "Avg. per step (ms)": +avg.toFixed(2),
      // the slowest 1 % of steps: this is where garbage collection shows up
      "Slowest 1 % (ms)": +times[Math.floor(times.length * 0.99)].toFixed(2),
      "Slowest (ms)": +times.at(-1).toFixed(2),
    });
  }

  const wasm = results.at(-1);
  for (const [i, r] of results.entries()) {
    rows[i]["Factor vs. Wasm"] = +(r.avg / wasm.avg).toFixed(2);
    rows[i]["Differing px"] = countDiffs(r.sim.pixels, wasm.sim.pixels);
  }

  console.log(`${target.toLocaleString("en")} particles ` +
              `(${wasm.sim.particleCount.toLocaleString("en")} alive at the end)`);
  console.table(rows);
}
