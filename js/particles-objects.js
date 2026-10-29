// Fireworks particle system: JavaScript with objects
// --------------------------------------------------
// Written the way you would normally write it in JavaScript:
// every particle is an object, every step builds a new array of the
// particles that are still alive. Thousands of objects are created and
// thrown away every second, and the garbage collector has to clean up.
// Same calculations in the same order as the other two variants.
import { DT, GRAVITY, DRAG, SPARKS, SPARK_SPEED, AVG_SPARK_LIFE, MAX_EXPLOSIONS,
         PALETTE, Random, plot, fade, sparkIntensity } from "./particles-common.js";

export class ObjectFireworks {
  constructor(width, height, target, seed) {
    this.width = width;
    this.height = height;
    this.capacity = target * 2;
    this.particles = [];
    this.random = new Random(seed);
    this.rocketAcc = 0;
    this.rocketsPerStep = target / (SPARKS * AVG_SPARK_LIFE) * DT;
    this.intensity = sparkIntensity(target);
    this.pixels = new Uint32Array(width * height);
  }

  get particleCount() {
    return this.particles.length;
  }

  step() {
    const { random, pixels, width, height } = this;

    // 1. launch new rockets
    this.rocketAcc += this.rocketsPerStep;
    while (this.rocketAcc >= 1.0) {
      this.rocketAcc -= 1.0;
      if (this.particles.length < this.capacity) {
        this.particles.push({
          x: random.next() * width,
          y: height,
          vx: (random.next() - 0.5) * 60.0,
          vy: -(340.0 + random.next() * 140.0),
          life: 0.9 + random.next() * 0.6,
          color: PALETTE[(random.next() * 6.0) | 0],
          rocket: true,
        });
      }
    }

    // 2. fade the previous frame
    fade(pixels);

    // 3. move, draw and remove dead particles
    const alive = [];
    const explosions = [];
    for (const p of this.particles) {
      p.vx *= DRAG;
      p.vy = p.vy * DRAG + GRAVITY * DT;
      p.x += p.vx * DT;
      p.y += p.vy * DT;
      p.life -= DT;

      if (p.life > 0.0) {
        plot(pixels, width, height, p.x, p.y, p.color, p.rocket ? 1.0 : Math.min(p.life, 1.0) * this.intensity);
        alive.push(p);
      } else if (p.rocket && explosions.length < MAX_EXPLOSIONS) {
        explosions.push(p);
      }
    }

    // 4. burst exploded rockets into sparks
    for (const rocket of explosions) {
      for (let s = 0; s < SPARKS; s++) {
        if (alive.length >= this.capacity) break;
        let dx, dy;
        do {
          dx = random.next() * 2.0 - 1.0;
          dy = random.next() * 2.0 - 1.0;
        } while (dx * dx + dy * dy > 1.0);

        alive.push({
          x: rocket.x,
          y: rocket.y,
          vx: dx * SPARK_SPEED,
          vy: dy * SPARK_SPEED,
          life: 1.0 + random.next(),
          color: rocket.color,
          rocket: false,
        });
      }
    }

    this.particles = alive;
  }
}
