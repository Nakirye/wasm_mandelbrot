// Fireworks particle system in AssemblyScript
// --------------------------------------------
// No objects: every particle field is a flat array in linear memory
// (structure of arrays). Particle i = position i in every array.
// Deliberately identical to js/particles-typed.js, so the comparison is fair
// and the images are identical pixel for pixel.

const DT: f64 = 1.0 / 60.0;
const GRAVITY: f64 = 120.0;      // pixels / s²
const DRAG: f64 = 0.985;         // velocity factor per step
const SPARKS: i32 = 400;         // sparks per explosion
const SPARK_SPEED: f64 = 150.0;  // pixels / s
const AVG_SPARK_LIFE: f64 = 1.5; // seconds (1.0 + random 0..1)
const MAX_EXPLOSIONS: i32 = 1024; // per step

const PALETTE: StaticArray<u32> = [
  // Kanagawa colours (0xAABBGGRR): carpYellow, crystalBlue, oniViolet,
  // waveAqua2, sakuraPink, surimiOrange
  0xFF84C3E6, 0xFFD89C7E, 0xFFB87F95, 0xFF9FA87A, 0xFF997ED2, 0xFF66A0FF,
];

let width: i32 = 0;
let height: i32 = 0;
let capacity: i32 = 0;
let count: i32 = 0;
let seed: u32 = 1;
let rocketsPerStep: f64 = 0;
let rocketAcc: f64 = 0;
let intensity: f64 = 1;   // spark brightness, lower with many particles

// field arrays (addresses in linear memory)
let xs: usize = 0;
let ys: usize = 0;
let vxs: usize = 0;
let vys: usize = 0;
let lifes: usize = 0;
let colors: usize = 0;
let rockets: usize = 0;   // 1 = rocket, 0 = spark
let frame: usize = 0;     // width * height pixels, 0xAABBGGRR

// explosions of the current step: x, y, color
let explX: usize = 0;
let explY: usize = 0;
let explC: usize = 0;

let allocated: i32 = 0;
let allocatedFrame: i32 = 0;

// Sets up a new simulation. `target` = desired number of particles alive.
// Returns the address of the frame buffer.
export function init(w: i32, h: i32, target: i32, rngSeed: u32): usize {
  width = w;
  height = h;
  capacity = target * 2;
  count = 0;
  seed = rngSeed;
  rocketAcc = 0;
  rocketsPerStep = <f64>target / (<f64>SPARKS * AVG_SPARK_LIFE) * DT;
  intensity = 30000.0 / <f64>target;
  if (intensity > 1.0) intensity = 1.0;

  // the stub runtime never frees memory, so only allocate when growing
  if (capacity > allocated) {
    xs = heap.alloc(<usize>capacity << 3);
    ys = heap.alloc(<usize>capacity << 3);
    vxs = heap.alloc(<usize>capacity << 3);
    vys = heap.alloc(<usize>capacity << 3);
    lifes = heap.alloc(<usize>capacity << 3);
    colors = heap.alloc(<usize>capacity << 2);
    rockets = heap.alloc(<usize>capacity << 2);
    allocated = capacity;
  }
  if (explX == 0) {
    explX = heap.alloc(<usize>MAX_EXPLOSIONS << 3);
    explY = heap.alloc(<usize>MAX_EXPLOSIONS << 3);
    explC = heap.alloc(<usize>MAX_EXPLOSIONS << 2);
  }
  if (w * h > allocatedFrame) {
    frame = heap.alloc(<usize>(w * h) << 2);
    allocatedFrame = w * h;
  }
  memory.fill(frame, 0, <usize>(w * h) << 2);
  return frame;
}

export function particleCount(): i32 {
  return count;
}

// Advances the simulation by one step (1/60 s) and draws the frame.
export function step(): void {
  // 1. launch new rockets
  rocketAcc += rocketsPerStep;
  while (rocketAcc >= 1.0) {
    rocketAcc -= 1.0;
    if (count < capacity) {
      const i = count++;
      setF(xs, i, rand() * <f64>width);
      setF(ys, i, <f64>height);
      setF(vxs, i, (rand() - 0.5) * 60.0);
      setF(vys, i, -(340.0 + rand() * 140.0));
      setF(lifes, i, 0.9 + rand() * 0.6);
      setU(colors, i, PALETTE[<i32>(rand() * 6.0)]);
      setU(rockets, i, 1);
    }
  }

  // 2. fade the previous frame (each channel * 3/4), keeps short trails
  const pixels = width * height;
  for (let p = 0; p < pixels; p++) {
    const ptr = frame + (<usize>p << 2);
    const v = load<u32>(ptr);
    store<u32>(ptr, (((v >> 1) & 0x7F7F7F7F) + ((v >> 2) & 0x3F3F3F3F)) | 0xFF000000);
  }

  // 3. move, draw and remove dead particles (keeps the order)
  let explosions: i32 = 0;
  let alive: i32 = 0;
  for (let i = 0; i < count; i++) {
    const vx = getF(vxs, i) * DRAG;
    const vy = getF(vys, i) * DRAG + GRAVITY * DT;
    const x = getF(xs, i) + vx * DT;
    const y = getF(ys, i) + vy * DT;
    const life = getF(lifes, i) - DT;
    const color = getU(colors, i);
    const rocket = getU(rockets, i);

    if (life > 0.0) {
      plot(x, y, color, rocket == 1 ? 1.0 : (life < 1.0 ? life : 1.0) * intensity);
      setF(xs, alive, x);
      setF(ys, alive, y);
      setF(vxs, alive, vx);
      setF(vys, alive, vy);
      setF(lifes, alive, life);
      setU(colors, alive, color);
      setU(rockets, alive, rocket);
      alive++;
    } else if (rocket == 1 && explosions < MAX_EXPLOSIONS) {
      setF(explX, explosions, x);
      setF(explY, explosions, y);
      setU(explC, explosions, color);
      explosions++;
    }
  }
  count = alive;

  // 4. burst exploded rockets into sparks
  for (let e = 0; e < explosions; e++) {
    for (let s = 0; s < SPARKS; s++) {
      if (count >= capacity) break;
      // random direction inside the unit circle (no sin/cos, so JS and
      // Wasm produce exactly the same numbers)
      let dx = 0.0;
      let dy = 0.0;
      do {
        dx = rand() * 2.0 - 1.0;
        dy = rand() * 2.0 - 1.0;
      } while (dx * dx + dy * dy > 1.0);

      const i = count++;
      setF(xs, i, getF(explX, e));
      setF(ys, i, getF(explY, e));
      setF(vxs, i, dx * SPARK_SPEED);
      setF(vys, i, dy * SPARK_SPEED);
      setF(lifes, i, 1.0 + rand());
      setU(colors, i, getU(explC, e));
      setU(rockets, i, 0);
    }
  }
}

// Adds a particle's colour to a pixel (saturating, so the order of
// drawing does not matter).
@inline
function plot(x: f64, y: f64, color: u32, brightness: f64): void {
  if (x < 0.0 || x >= <f64>width || y < 0.0 || y >= <f64>height) return;
  const ptr = frame + (<usize>(<i32>y * width + <i32>x) << 2);
  const p = load<u32>(ptr);
  let r = (p & 0xFF) + <u32>(<f64>(color & 0xFF) * brightness);
  let g = ((p >> 8) & 0xFF) + <u32>(<f64>((color >> 8) & 0xFF) * brightness);
  let b = ((p >> 16) & 0xFF) + <u32>(<f64>((color >> 16) & 0xFF) * brightness);
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;
  store<u32>(ptr, 0xFF000000 | (b << 16) | (g << 8) | r);
}

// xorshift32: small random number generator, identical in JS
@inline
function rand(): f64 {
  let x = seed;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  seed = x;
  return <f64>x / 4294967296.0;
}

@inline function getF(base: usize, i: i32): f64 { return load<f64>(base + (<usize>i << 3)); }
@inline function setF(base: usize, i: i32, v: f64): void { store<f64>(base + (<usize>i << 3), v); }
@inline function getU(base: usize, i: i32): u32 { return load<u32>(base + (<usize>i << 2)); }
@inline function setU(base: usize, i: i32, v: u32): void { store<u32>(base + (<usize>i << 2), v); }
