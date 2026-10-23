// Hilfsfunktionen für die Messung (Browser und Node)

// Führt fn erst ein paar Mal zum Aufwärmen aus (damit der JIT-Compiler
// von JavaScript fair behandelt wird), misst dann `runs` Durchläufe
// und gibt Median und Minimum in Millisekunden zurück.
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

// Zählt, wie viele Pixel sich zwischen zwei Ergebnissen unterscheiden.
export function countDiffs(a, b) {
  let diffs = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diffs++;
  return diffs;
}

// Importe, die das Wasm-Modul erwartet (wird nur bei Fehlern aufgerufen)
export const wasmImports = {
  env: {
    abort(msg, file, line, col) {
      throw new Error(`Wasm abort bei ${line}:${col}`);
    },
  },
};

// Bildausschnitte zum Ausprobieren
export const PRESETS = {
  overview: { label: "Übersicht", cx: -0.5, cy: 0.0, zoom: 1 },
  seahorse: { label: "Seepferdchental (Zoom 60)", cx: -0.7435, cy: 0.1314, zoom: 60 },
};
