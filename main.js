import { mandelbrotJS } from "./js/mandelbrot.js";
import { measure, countDiffs, wasmImports, PRESETS } from "./js/bench-utils.js";

const $ = (id) => document.getElementById(id);

// 1. Load the Wasm module
const { instance } = await WebAssembly.instantiateStreaming(
  fetch("build/release.wasm"),
  wasmImports,
);
const wasm = instance.exports;

const VARIANTS = {
  js: "JavaScript",
  wasm: "WebAssembly",
  simd: "WebAssembly + SIMD",
};

// Add the presets to the dropdown
for (const [key, p] of Object.entries(PRESETS)) {
  $("preset").add(new Option(p.label, key));
}
setStatus("Ready.");
$("run").addEventListener("click", runBenchmark);

async function runBenchmark() {
  const params = {
    width: +$("width").value,
    height: +$("height").value,
    maxIter: +$("maxIter").value,
    ...PRESETS[$("preset").value],
  };
  const runs = +$("runs").value;
  const cold = $("mode").value === "cold";
  const selected = Object.keys(VARIANTS).filter((v) => $(`use-${v}`).checked);
  if (selected.length === 0) {
    setStatus("Select at least one variant.", "warn");
    return;
  }

  $("run").disabled = true;
  $("results").innerHTML = "";
  $("canvases").innerHTML = "";

  const results = [];
  for (const variant of selected) {
    setStatus(`Measuring ${VARIANTS[variant]} …` +
      (cold ? "" : " (the window may freeze briefly)"), "busy");
    await nextFrame(); // let the browser display the status message
    results.push({ variant, ...(cold
      ? await measureCold(variant, params, runs)
      : measureWarm(variant, params, runs)) });
  }

  showResults(results, params, cold);
  $("run").disabled = false;
}

// Warmed up: 3 runs warm-up, then the median of `runs` runs (main thread)
function measureWarm(variant, { width, height, maxIter, cx, cy, zoom }, runs) {
  if (variant === "js") {
    const pixels = new Uint32Array(width * height);
    const time = measure(() => mandelbrotJS(pixels, width, height, maxIter, cx, cy, zoom), runs);
    return { time, pixels };
  }

  // Create the view (Uint32Array) only AFTER allocBuffer,
  // because memory may grow during allocation.
  const ptr = wasm.allocBuffer(width, height);
  const fn = variant === "simd" ? wasm.mandelbrotSimd : wasm.mandelbrot;
  const time = measure(() => fn(width, height, maxIter, cx, cy, zoom), runs);
  // copy, because all Wasm variants share the same buffer
  const pixels = new Uint32Array(wasm.memory.buffer, ptr, width * height).slice();
  return { time, pixels };
}

// Cold start: `runs` fresh workers, each measures its 1st and 2nd call
async function measureCold(variant, params, runs) {
  const firsts = [];
  const seconds = [];
  let pixels;

  for (let i = 0; i < runs; i++) {
    const worker = new Worker("js/cold-worker.js", { type: "module" });
    const result = await new Promise((resolve, reject) => {
      worker.onmessage = ({ data }) => resolve(data);
      worker.onerror = reject;
      worker.postMessage({ variant, ...params });
    });
    worker.terminate();
    firsts.push(result.first);
    seconds.push(result.second);
    pixels = result.pixels;
  }

  return { time: { median: median(firsts), min: Math.min(...firsts) },
           second: median(seconds), pixels };
}

function showResults(results, { width, height }, cold) {
  // Speed-up relative to JavaScript, if it was measured
  const js = results.find((r) => r.variant === "js");
  const reference = results[0];

  $("resultsHead").innerHTML = cold
    ? "<tr><th>Variant</th><th>1st call</th><th></th><th>1st call (min.)</th><th>2nd call</th><th>vs. JS (1st call)</th></tr>"
    : "<tr><th>Variant</th><th>Median</th><th></th><th>Minimum</th><th>vs. JS</th></tr>";

  // bars: the slowest variant fills the whole bar
  const slowest = Math.max(...results.map((r) => r.time.median));

  let diffs = 0;
  for (const r of results) {
    diffs += countDiffs(reference.pixels, r.pixels);
    const speedup = js ? `${(js.time.median / r.time.median).toFixed(2)}×` : "–";
    const share = (r.time.median / slowest) * 100;
    $("results").insertAdjacentHTML("beforeend", `<tr data-variant="${r.variant}">
      <td class="name"><span class="dot"></span>${VARIANTS[r.variant]}</td>
      <td>${r.time.median.toFixed(1)} ms</td>
      <td class="bar-cell"><div class="bar"><span style="width: 0" data-width="${share}%"></span></div></td>
      <td>${r.time.min.toFixed(1)} ms</td>
      ${cold ? `<td>${r.second.toFixed(1)} ms</td>` : ""}
      <td class="speedup">${speedup}</td></tr>`);

    const figure = document.createElement("figure");
    figure.className = "view";
    figure.dataset.variant = r.variant;
    figure.innerHTML = `<figcaption><span class="dot"></span>${VARIANTS[r.variant]}</figcaption><canvas></canvas>`;
    draw(figure.querySelector("canvas"), r.pixels, width, height);
    $("canvases").append(figure);
  }

  // let the bars grow in
  requestAnimationFrame(() => {
    for (const bar of $("results").querySelectorAll("[data-width]")) bar.style.width = bar.dataset.width;
  });

  if (results.length < 2) setStatus("Done.", "ok");
  else if (diffs === 0) setStatus("Done. All results are identical pixel for pixel.", "ok");
  else setStatus(`Done, but ${diffs} pixels differ.`, "warn");
}

// state: "" (neutral), "busy", "ok" or "warn"
function setStatus(text, state = "") {
  $("status").textContent = text;
  $("status").className = `status ${state}`;
}

function draw(canvas, pixels, width, height) {
  canvas.width = width;
  canvas.height = height;
  const bytes = new Uint8ClampedArray(pixels.buffer, pixels.byteOffset, width * height * 4);
  canvas.getContext("2d").putImageData(new ImageData(bytes, width, height), 0, 0);
}

function median(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
}
