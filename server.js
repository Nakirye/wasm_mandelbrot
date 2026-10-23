// Mini-Webserver ohne Abhängigkeiten: npm start
// (Wasm lässt sich nicht über file:// laden, daher braucht es einen Server.)
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = 8080;
const ROOT = process.cwd();
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".wasm": "application/wasm",
  ".css": "text/css",
};

createServer(async (req, res) => {
  const path = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const file = join(ROOT, normalize(path));
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();

  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("Nicht gefunden");
  }
}).listen(PORT, () => console.log(`Läuft auf http://localhost:${PORT}`));
