// Shared parts of the two JavaScript fireworks variants.
// The same constants are in assembly/particles.ts; keep them in sync.

export const DT = 1.0 / 60.0;
export const GRAVITY = 120.0;      // pixels / s²
export const DRAG = 0.985;         // velocity factor per step
export const SPARKS = 400;         // sparks per explosion
export const SPARK_SPEED = 150.0;  // pixels / s
export const AVG_SPARK_LIFE = 1.5; // seconds (1.0 + random 0..1)
export const MAX_EXPLOSIONS = 1024; // per step

export const PALETTE = new Uint32Array([
  // Kanagawa colours (0xAABBGGRR): carpYellow, crystalBlue, oniViolet,
  // waveAqua2, sakuraPink, surimiOrange
  0xFF84C3E6, 0xFFD89C7E, 0xFFB87F95, 0xFF9FA87A, 0xFF997ED2, 0xFF66A0FF,
]);

// Spark brightness: lower with many particles, so the image does not
// turn completely white
export function sparkIntensity(target) {
  const intensity = 30000.0 / target;
  return intensity > 1.0 ? 1.0 : intensity;
}

// xorshift32: small random number generator, identical in Wasm
export class Random {
  constructor(seed) {
    this.seed = seed >>> 0;
  }

  next() {
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 4294967296.0;
  }
}

// Fades the previous frame (each channel * 3/4), keeps short trails
export function fade(pixels) {
  for (let p = 0; p < pixels.length; p++) {
    const v = pixels[p];
    pixels[p] = (((v >>> 1) & 0x7F7F7F7F) + ((v >>> 2) & 0x3F3F3F3F)) | 0xFF000000;
  }
}

// Adds a particle's colour to a pixel (saturating, so the order of
// drawing does not matter).
export function plot(pixels, width, height, x, y, color, brightness) {
  if (x < 0.0 || x >= width || y < 0.0 || y >= height) return;
  const idx = (y | 0) * width + (x | 0);
  const p = pixels[idx];
  let r = (p & 0xFF) + (((color & 0xFF) * brightness) | 0);
  let g = ((p >>> 8) & 0xFF) + ((((color >>> 8) & 0xFF) * brightness) | 0);
  let b = ((p >>> 16) & 0xFF) + ((((color >>> 16) & 0xFF) * brightness) | 0);
  if (r > 255) r = 255;
  if (g > 255) g = 255;
  if (b > 255) b = 255;
  pixels[idx] = 0xFF000000 | (b << 16) | (g << 8) | r;
}
