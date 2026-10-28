// Helper functions for measuring (browser and Node)

// Runs fn a few times first to warm up (so JavaScript's JIT compiler
// is treated fairly), then measures `runs` runs
// and returns the median and minimum in milliseconds.
export function measure(fn, runs = 10, warmup = 3) {
  for (let i = 0; i < warmup; i++) fn();

  const times = [];
  for (let i = 0; i < runs; i++) {
    const t0 = performance.now();
    fn();
    times.push(performance.now() - t0);
  }

  times.sort((a, b) => a - b);
  const mid = Math.floor(times.length / 2);
  const median = times.length % 2 ? times[mid] : (times[mid - 1] + times[mid]) / 2;
  return { median, min: times[0] };
}

// Counts how many pixels differ between two results.
export function countDiffs(a, b) {
  let diffs = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diffs++;
  return diffs;
}

// Imports the Wasm module expects (only called on errors)
export const wasmImports = {
  env: {
    abort(msg, file, line, col) {
      throw new Error(`Wasm abort at ${line}:${col}`);
    },
  },
};

// Image sections to try out
export const PRESETS = {
  overview: { label: "Overview", cx: -0.5, cy: 0.0, zoom: 1 },
  seahorse: { label: "Seahorse Valley (zoom 60)", cx: -0.7435, cy: 0.1314, zoom: 60 },
};
