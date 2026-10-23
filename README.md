# Mandelbrot: JavaScript vs. WebAssembly

Berechnet die Mandelbrot-Menge einmal in JavaScript und einmal in AssemblyScript
(kompiliert zu WebAssembly) und vergleicht die Ausführungszeiten.

## Voraussetzungen

- Node.js 18 oder neuer

## Setup

```bash
npm install --save-dev assemblyscript
npm run build
```

`npm run build` erzeugt `build/release.wasm` (und `build/release.wat`, das
lesbare Text-Format des Wasm-Moduls).

## Ausführen

**Im Browser** (mit Bildern und Ergebnistabelle):

```bash
npm start
```

Dann <http://localhost:8080> öffnen und „Benchmark starten“ klicken.

**Im Terminal:**

```bash
npm run bench
```

## Projektaufbau

| Datei | Inhalt |
|---|---|
| `assembly/index.ts` | Mandelbrot in AssemblyScript |
| `js/mandelbrot.js` | derselbe Algorithmus in JavaScript |
| `js/bench-utils.js` | Messung (Aufwärmen, Median), Pixelvergleich, Ausschnitte |
| `main.js` + `index.html` | Benchmark-Seite im Browser |
| `bench-node.mjs` | Benchmark im Terminal |
| `server.js` | kleiner Webserver (Wasm lässt sich nicht über `file://` laden) |
| `asconfig.json` | Compiler-Einstellungen (Release: `-O3`, Runtime `stub`) |

## Wie gemessen wird

- Jede Variante läuft zuerst 3× zum Aufwärmen, damit der JIT-Compiler von
  JavaScript fair behandelt wird.
- Danach 10 Messläufe mit `performance.now()`, angegeben wird der **Median**.
- Beide Varianten verwenden identischen Code und identische Rechenreihenfolge.
  Die Seite prüft, ob beide Bilder pixelgenau übereinstimmen.
- Die Wasm-Variante schreibt direkt in ihren linearen Speicher. JavaScript
  liest das Bild von dort ohne Kopie aus.

## Ergebnisse

_Eigene Messwerte hier eintragen (Browser, Rechner, Werte aus der Tabelle)._
