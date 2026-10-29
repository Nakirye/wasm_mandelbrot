// Live fireworks: three variants side by side, each in its own worker.
// On every screen refresh, every side that is done with its last step
// gets the next one. A slow side skips refreshes, so it gets choppy.

const $ = (id) => document.getElementById(id);

const WIDTH = 640;
const HEIGHT = 400;
const SEED = 42;
const VARIANTS = {
  objects: "JavaScript (objects)",
  typed: "JavaScript (typed arrays)",
  wasm: "WebAssembly",
};

let sides = [];

function createSide(variant) {
  const figure = document.createElement("figure");
  figure.className = "view";
  figure.dataset.variant = variant;
  figure.innerHTML = `<figcaption><span class="dot"></span>${VARIANTS[variant]}</figcaption>
    <canvas width="${WIDTH}" height="${HEIGHT}"></canvas>
    <div class="stats">Loading …</div>`;
  $("canvases").append(figure);

  const ctx = figure.querySelector("canvas").getContext("2d");
  const statsEl = figure.querySelector(".stats");
  const side = { busy: true, frames: [], worker: null };

  side.worker = new Worker("js/particles-worker.js", { type: "module" });
  side.worker.onmessage = ({ data }) => {
    if (data.ready) {
      side.worker.postMessage({ type: "init", variant, width: WIDTH, height: HEIGHT,
                                target: +$("target").value, seed: SEED });
    } else {
      show(data);
    }
    side.busy = false;
  };

  side.requestStep = () => {
    if (side.busy) return;
    side.busy = true;
    side.worker.postMessage({ type: "step" });
  };

  function show({ pixels, ms, count }) {
    const bytes = new Uint8ClampedArray(pixels.buffer);
    ctx.putImageData(new ImageData(bytes, WIDTH, HEIGHT), 0, 0);

    // statistics over the last 2 seconds
    const now = performance.now();
    side.frames = [...side.frames.filter((f) => now - f.at < 2000), { at: now, ms }];
    const fps = side.frames.filter((f) => now - f.at < 1000).length;
    const avg = side.frames.reduce((a, f) => a + f.ms, 0) / side.frames.length;
    const worst = Math.max(...side.frames.map((f) => f.ms));

    statsEl.innerHTML = `
      <span class="fps">${fps}<small>FPS</small></span>
      <span>${avg.toFixed(1)} ms per step</span>
      <span>slowest ${worst.toFixed(1)} ms</span>
      <span>${count.toLocaleString("en")} particles</span>
      <div class="bar"><span style="width: ${Math.min(100, (fps / 60) * 100)}%"></span></div>`;
  }

  return side;
}

function start() {
  for (const side of sides) side.worker.terminate();
  $("canvases").innerHTML = "";
  sides = Object.keys(VARIANTS).map(createSide);
}

function tick() {
  for (const side of sides) side.requestStep();
  requestAnimationFrame(tick);
}

$("restart").addEventListener("click", start);
$("target").addEventListener("change", start);
start();
requestAnimationFrame(tick);
