// Fireworks particle system: JavaScript with typed arrays
// -------------------------------------------------------
// No objects: every particle field is its own typed array
// (structure of arrays). Particle i = position i in every array.
// This is exactly how the Wasm version stores its data, so this variant
// shows how fast JavaScript gets with the same data layout.
import { DT, GRAVITY, DRAG, SPARKS, SPARK_SPEED, AVG_SPARK_LIFE, MAX_EXPLOSIONS,
         PALETTE, Random, plot, fade, sparkIntensity } from "./particles-common.js";

export class TypedFireworks {
  constructor(width, height, target, seed) {
    this.width = width;
    this.height = height;
    this.capacity = target * 2;
    this.count = 0;
    this.random = new Random(seed);
    this.rocketAcc = 0;
    this.rocketsPerStep = target / (SPARKS * AVG_SPARK_LIFE) * DT;
    this.intensity = sparkIntensity(target);

    this.xs = new Float64Array(this.capacity);
    this.ys = new Float64Array(this.capacity);
    this.vxs = new Float64Array(this.capacity);
    this.vys = new Float64Array(this.capacity);
    this.lifes = new Float64Array(this.capacity);
    this.colors = new Uint32Array(this.capacity);
    this.rockets = new Uint32Array(this.capacity);

    this.explX = new Float64Array(MAX_EXPLOSIONS);
    this.explY = new Float64Array(MAX_EXPLOSIONS);
    this.explC = new Uint32Array(MAX_EXPLOSIONS);

    this.pixels = new Uint32Array(width * height);
  }

  get particleCount() {
    return this.count;
  }

  step() {
    const { xs, ys, vxs, vys, lifes, colors, rockets, explX, explY, explC,
            capacity, random, pixels, width, height } = this;

    // 1. launch new rockets
    this.rocketAcc += this.rocketsPerStep;
    while (this.rocketAcc >= 1.0) {
      this.rocketAcc -= 1.0;
      if (this.count < capacity) {
        const i = this.count++;
        xs[i] = random.next() * width;
        ys[i] = height;
        vxs[i] = (random.next() - 0.5) * 60.0;
        vys[i] = -(340.0 + random.next() * 140.0);
        lifes[i] = 0.9 + random.next() * 0.6;
        colors[i] = PALETTE[(random.next() * 6.0) | 0];
        rockets[i] = 1;
      }
    }

    // 2. fade the previous frame
    fade(pixels);

    // 3. move, draw and remove dead particles (keeps the order)
    let explosions = 0;
    let alive = 0;
    for (let i = 0; i < this.count; i++) {
      const vx = vxs[i] * DRAG;
      const vy = vys[i] * DRAG + GRAVITY * DT;
      const x = xs[i] + vx * DT;
      const y = ys[i] + vy * DT;
      const life = lifes[i] - DT;
      const color = colors[i];
      const rocket = rockets[i];

      if (life > 0.0) {
        plot(pixels, width, height, x, y, color, rocket === 1 ? 1.0 : (life < 1.0 ? life : 1.0) * this.intensity);
        xs[alive] = x;
        ys[alive] = y;
        vxs[alive] = vx;
        vys[alive] = vy;
        lifes[alive] = life;
        colors[alive] = color;
        rockets[alive] = rocket;
        alive++;
      } else if (rocket === 1 && explosions < MAX_EXPLOSIONS) {
        explX[explosions] = x;
        explY[explosions] = y;
        explC[explosions] = color;
        explosions++;
      }
    }
    this.count = alive;

    // 4. burst exploded rockets into sparks
    for (let e = 0; e < explosions; e++) {
      for (let s = 0; s < SPARKS; s++) {
        if (this.count >= capacity) break;
        let dx, dy;
        do {
          dx = random.next() * 2.0 - 1.0;
          dy = random.next() * 2.0 - 1.0;
        } while (dx * dx + dy * dy > 1.0);

        const i = this.count++;
        xs[i] = explX[e];
        ys[i] = explY[e];
        vxs[i] = dx * SPARK_SPEED;
        vys[i] = dy * SPARK_SPEED;
        lifes[i] = 1.0 + random.next();
        colors[i] = explC[e];
        rockets[i] = 0;
      }
    }
  }
}
