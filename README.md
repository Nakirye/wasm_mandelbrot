# Getting familiar with WebAssembly

The assignment was simply: *"Get familiar with WebAssembly."* I had never
used Wasm before, so I picked something where speed should matter and wrote
it twice, once in JavaScript and once in WebAssembly, to see what actually
happens. This README is a summary of what I tried, what came out, and what
I learned along the way. Most of it surprised me.

## What is WebAssembly, in short?

WebAssembly (Wasm) is a compact binary format that browsers (and Node.js)
can run next to JavaScript. You don't write it by hand. You write code in
another language and compile it to a `.wasm` file. I used
[AssemblyScript](https://www.assemblyscript.org/), because it looks almost
like TypeScript, so I didn't have to learn C++ or Rust first.

The usual promise is "Wasm is faster than JavaScript". Testing that promise
became the main thread of this project.

## Setup and running

Requirements: Node.js 18 or newer.

```bash
npm install
npm run build   # compiles assembly/*.ts to build/*.wasm
npm start       # web server on http://localhost:8080
```

A small server is needed because browsers don't load `.wasm` files from
`file://`.

The web page has three parts:

- **Benchmark:** Mandelbrot in JavaScript, Wasm and Wasm + SIMD, with a
  results table. Variants can be switched on and off, and you can choose
  between "warmed up" and "cold start".
- **Live zoom:** JavaScript and Wasm zoom into the Mandelbrot set side by
  side. You can see the frames per second.
- **Fireworks:** a particle system in three versions, also running live.

The same measurements are also available in the terminal:

```bash
npm run bench            # Mandelbrot, warmed up
npm run bench:cold       # Mandelbrot, very first call only
npm run bench:particles  # fireworks
```

## Step 1: Mandelbrot, same code in JS and Wasm

The Mandelbrot set is a classic for benchmarks: for every pixel, the same
small formula is repeated up to a few thousand times. That is pure number
crunching, so I expected Wasm to win clearly.

I wrote the algorithm in `js/mandelbrot.js` and `assembly/index.ts`, line by
line the same, so the comparison is fair. Both versions produce the exact
same image (the page checks this pixel by pixel).

To measure fairly, every variant runs 3 times first (warm-up), then 10
times for real, and the median is reported. The warm-up matters: the
browser optimises code while it runs, so the first runs are not
representative.

**Result: no difference.**

| Max. iterations | JS | Wasm | JS / Wasm |
|---|---|---|---|
| 100 | 15.5 ms | 16.0 ms | 0.97× |
| 1000 | 127.6 ms | 128.0 ms | 1.00× |
| 3000 | 374.0 ms | 372.4 ms | 1.00× |

At first I thought my measurement was broken. As far as I understand it
now, the result is correct: modern JavaScript engines (V8 in Chrome and
Node) compile hot JavaScript code to machine code while it runs (the "JIT
compiler"). For a simple loop that only does math with numbers, the
result is practically the same machine code that the Wasm compiler
produces. So **Wasm is not automatically faster than JavaScript.**

## Step 2: SIMD, something JavaScript can't do

If the same code gives the same speed, Wasm can only win by doing something
JavaScript cannot do. One of those things is **SIMD** ("single instruction,
multiple data"): the processor does the same calculation on several numbers
at once. JavaScript has no access to this, Wasm does.

`mandelbrotSimd` in `assembly/index.ts` calculates **two neighbouring pixels
at the same time**. Each of the two "lanes" does exactly the same steps as
the normal version, so the image is still identical.

| Max. iterations | JS | Wasm | Wasm + SIMD | JS / SIMD |
|---|---|---|---|---|
| 100 | 15.5 ms | 16.0 ms | 11.1 ms | 1.39× |
| 1000 | 127.6 ms | 128.0 ms | 73.3 ms | 1.74× |
| 3000 | 374.0 ms | 372.4 ms | 210.4 ms | 1.78× |

Now Wasm is clearly faster. It is not quite 2×, because the two pixels are
calculated together: if one is already finished, it has to wait until the
other one is done too.

SIMD had to be switched on in `asconfig.json` (`"enable": ["simd"]`).

## Step 3: Cold start, where Wasm loses

Out of curiosity I also measured the very first call, without any warm-up
(`npm run bench:cold`, each measurement in a fresh Node process):

| Variant | 1st call | 2nd call |
|---|---|---|
| JavaScript | 133.1 ms | 127.2 ms |
| Wasm | 255.9 ms | 128.4 ms |
| Wasm + SIMD | 134.2 ms | 73.5 ms |

On its first call, Wasm takes **twice as long** as JavaScript. From what I
read about V8, Wasm is first compiled quickly but not very well, and the
optimised version is only used from the next call onwards. JavaScript
can switch to optimised code in the middle of a running loop, so its first
call is already fast.

In the browser I ran into a trap here: Chrome remembers already compiled
Wasm code. After a warmed-up run, the "cold" measurement suddenly looked
just as fast as the warm one. To get a real cold start, `js/cold-worker.js`
adds a few random bytes to the module, so the browser can't find it in its
cache. It took me a while to figure that out.

## Step 4: Fireworks, memory instead of math

A classmate built a tree generator and got Wasm 4–6× faster, which didn't
fit my Mandelbrot results at all. The difference: his program creates lots
of objects, Mandelbrot creates none. So I built a second test that is all
about objects: **fireworks**. Rockets burst into 400 sparks each, the sparks
fall and burn out after 1–2 seconds. Hundreds of thousands of particles
appear and disappear all the time.

There are three versions:

- **JS objects** (`js/particles-objects.js`): one object per particle, the
  way I would normally write it. Burnt-out sparks have to be cleaned up by
  the garbage collector, which pauses the program for short moments.
- **JS typed arrays** (`js/particles-typed.js`): no objects. Instead, one
  array of numbers per property (`xs`, `ys`, `vxs`, `vys`, …). Particle
  number `i` is position `i` in every array, like columns in a table.
  Nothing to clean up.
- **Wasm** (`assembly/particles.ts`): the same table layout, inside the Wasm
  memory. Wasm has no JavaScript objects, so this is the natural way to
  write it there.

All three produce the same image, pixel for pixel. Time per step (lower is
better, factor compared to Wasm):

| Particles | JS objects | JS typed arrays | Wasm |
|---|---|---|---|
| 10,000 | 0.46 ms (2.0×) | 0.38 ms (1.6×) | 0.23 ms |
| 100,000 | 4.65 ms (3.8×) | 1.46 ms (1.2×) | 1.22 ms |
| 300,000 | 14.73 ms (4.0×) | 3.63 ms (1.0×) | 3.67 ms |
| 1,000,000 | 105.04 ms (8.9×) | 11.66 ms (1.0×) | 11.82 ms |

With objects, JavaScript gets up to 9× slower than Wasm, and the gap grows
with the number of particles, just like with my classmate's tree. On the
live page that means 20 FPS against 60 FPS at one million particles, and
the object version visibly stutters.

But the typed-array version is almost as fast as Wasm (1.0× to 1.6×, it
varies between runs). So the big gap does not come from Wasm itself, but
from **how the data is stored in memory**. Wasm simply pushes you into the
fast way of doing it, because there are no objects to fall back on.

## What I learned

- Wasm is **not automatically faster**. For plain number crunching, the
  JavaScript engine is already very good.
- Wasm wins where it can do things JavaScript can't, like **SIMD**
  (here about 1.75×).
- Wasm wins clearly when JavaScript would create **lots of objects**
  (here up to 9×). JavaScript can almost catch up with typed arrays, but
  you have to write it that way on purpose.
- Wasm is **slower on the very first call**. For short tasks that only run
  once, it may not be worth it.
- Measuring is harder than expected: warm-up, caching and the garbage
  collector of other code can all distort the numbers.

What I didn't try: multithreading in Wasm, 64-bit integers, and using
existing C/C++ or Rust libraries in the browser. From what I read, the last
one is actually one of the main reasons Wasm is used in practice (e.g.
running SQLite or image editing code in the browser), not only speed.

## Notes on the numbers

All numbers above were measured on my machine with Node.js 24 (the browser
tests with Chromium 155). They vary by a few percent between runs, and on
other machines the absolute times will be different. The ratios between
the variants should be similar.

## Project structure

| File | Contents |
|---|---|
| `assembly/index.ts` | Mandelbrot in AssemblyScript (normal + SIMD) |
| `assembly/particles.ts` | fireworks in AssemblyScript |
| `js/mandelbrot.js` | Mandelbrot in JavaScript |
| `js/particles-objects.js` | fireworks in JavaScript with objects |
| `js/particles-typed.js` | fireworks in JavaScript with typed arrays |
| `js/particles-common.js` | parts shared by both JavaScript fireworks |
| `js/particles-wasm.js` | makes the Wasm fireworks usable like the JS versions |
| `js/bench-utils.js` | measuring (warm-up, median) and pixel comparison |
| `js/*-worker.js` | Web Workers: run calculations in the background |
| `index.html`, `zoom.html`, `particles.html` | the three web pages (+ `.js` file each) |
| `css/style.css` | shared design of the web pages |
| `bench-*.mjs` | benchmarks for the terminal |
| `server.js` | small web server |
| `asconfig.json` | AssemblyScript compiler settings |
| `build/` | compiled `.wasm` files, plus `.wat` (readable text version) |
