// Live zoom: JavaScript and Wasm render the same view side by side.
// Each side has its own worker and asks for the next frame as soon as
// the previous one is done, so frames per second = speed of the variant.

const $ = (id) => document.getElementById(id);

// Start at a detailed spot in Seahorse Valley
const HOME = { cx: -0.743643887037151, cy: 0.13182590420533, zoom: 1 };
const MAX_ZOOM = 1e10;      // beyond that, f64 runs out of precision
const ZOOM_PER_SECOND = 2;  // auto zoom: factor per second

const view = { ...HOME };
let width = 640;
let height = 480;
let autoZoom = false;

// More iterations the deeper we zoom, otherwise the edge turns black
const maxIterFor = (zoom) => Math.round(200 + 150 * Math.log10(Math.max(zoom, 1)));

// One side of the page: a worker, a canvas and its statistics
function createSide(canvas, statsEl, engine) {
  const side = { engine, frameTimes: [], frameStamps: [], worker: null };

  side.start = (newEngine) => {
    side.worker?.terminate();
    side.engine = newEngine ?? side.engine;
    side.frameTimes = [];
    side.frameStamps = [];
    statsEl.textContent = "Loading …";
    side.worker = new Worker("js/render-worker.js", { type: "module" });
    side.worker.onmessage = ({ data }) => {
      if (!data.ready) show(data);
      requestFrame();
    };
  };

  function requestFrame() {
    side.worker.postMessage({
      engine: side.engine, width, height,
      maxIter: maxIterFor(view.zoom), ...view,
    });
  }

  function show({ pixels, width: w, height: h, ms, zoom }) {
    canvas.width = w;
    canvas.height = h;
    const bytes = new Uint8ClampedArray(pixels.buffer);
    canvas.getContext("2d").putImageData(new ImageData(bytes, w, h), 0, 0);

    // average render time of the last 20 frames, frames in the last second
    const now = performance.now();
    side.frameTimes = [...side.frameTimes.slice(-19), ms];
    side.frameStamps = [...side.frameStamps.filter((t) => now - t < 1000), now];
    const avg = side.frameTimes.reduce((a, b) => a + b, 0) / side.frameTimes.length;

    const fps = side.frameStamps.length;
    statsEl.innerHTML = `
      <span class="fps">${fps}<small>FPS</small></span>
      <span>${avg.toFixed(1)} ms per frame</span>
      <span>zoom ${formatZoom(zoom)}</span>
      <div class="bar"><span style="width: ${Math.min(100, (fps / 60) * 100)}%"></span></div>`;
  }

  return side;
}

const left = createSide($("canvasLeft"), $("statsLeft"), "js");
const right = createSide($("canvasRight"), $("statsRight"), "simd");
left.start();
right.start();

// --- Controls ---

$("engine").addEventListener("change", (e) => {
  $("captionRight").textContent = e.target.selectedOptions[0].text;
  $("figureRight").dataset.variant = e.target.value;
  right.start(e.target.value);
});

$("size").addEventListener("change", (e) => {
  [width, height] = e.target.value.split("x").map(Number);
});

$("auto").addEventListener("click", () => {
  autoZoom = !autoZoom;
  $("auto").textContent = autoZoom ? "Stop auto zoom" : "Start auto zoom";
});

$("reset").addEventListener("click", () => Object.assign(view, HOME));

// Auto zoom: zoom in continuously, start over at MAX_ZOOM
let last = performance.now();
function tick(now) {
  const dt = (now - last) / 1000;
  last = now;
  if (autoZoom) {
    view.zoom *= ZOOM_PER_SECOND ** dt;
    if (view.zoom > MAX_ZOOM) view.zoom = 1;
  }
  $("view").textContent =
    `Current view: zoom ${formatZoom(view.zoom)}, ${maxIterFor(view.zoom)} iterations, ` +
    `centre (${view.cx.toFixed(12)}, ${view.cy.toFixed(12)})`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Dragging and scrolling work on both canvases
for (const canvas of [$("canvasLeft"), $("canvasRight")]) {
  let drag = null;

  canvas.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    // pixels on screen -> distance in the complex plane (see scale in mandelbrot.js)
    const scale = 3.0 / (canvas.clientHeight * view.zoom);
    view.cx -= (e.clientX - drag.x) * scale;
    view.cy -= (e.clientY - drag.y) * scale;
    drag = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener("pointerup", () => { drag = null; });

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    view.zoom = Math.min(MAX_ZOOM, Math.max(0.5, view.zoom * (e.deltaY < 0 ? 1.25 : 0.8)));
  }, { passive: false });
}

function formatZoom(zoom) {
  return zoom < 1000 ? zoom.toFixed(1) + "×" : zoom.toExponential(1) + "×";
}
