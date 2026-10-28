# Mandelbrot: JavaScript vs. WebAssembly

Computes the Mandelbrot set once in JavaScript and once in AssemblyScript
(compiled to WebAssembly) and compares the execution times.

## Requirements

- Node.js 18 or newer

## Setup

```bash
npm install --save-dev assemblyscript
npm run build
```

`npm run build` generates `build/release.wasm` (and `build/release.wat`, the
readable text format of the Wasm module).

## Running

**In the browser** (with images and results table):

```bash
npm start
```

Then open <http://localhost:8080> and click "Run benchmark".

**In the terminal:**

```bash
npm run bench
```

## Project structure

| File | Contents |
|---|---|
| `assembly/index.ts` | Mandelbrot in AssemblyScript |
| `js/mandelbrot.js` | the same algorithm in JavaScript |
| `js/bench-utils.js` | measuring (warm-up, median), pixel comparison, presets |
| `main.js` + `index.html` | benchmark page in the browser |
| `bench-node.mjs` | benchmark in the terminal |
| `server.js` | small web server (Wasm can't be loaded via `file://`) |
| `asconfig.json` | compiler settings (release: `-O3`, runtime `stub`) |

## How it is measured

- Each variant first runs 3× to warm up, so that JavaScript's JIT compiler
  is treated fairly.
- Then 10 measurement runs with `performance.now()`; the **median** is reported.
- Both variants use identical code and an identical order of operations.
  The page checks whether both images match pixel for pixel.
- The Wasm variant writes directly into its linear memory. JavaScript
  reads the image from there without copying.

## Results

_Enter your own measurements here (browser, machine, values from the table)._
