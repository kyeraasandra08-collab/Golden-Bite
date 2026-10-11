/**
 * Serves the built site (out/) the way Cloudflare Pages does: clean URLs, the custom 404 page and
 * the headers from out/_headers. Used by `npm start` to preview the production build and by the
 * end-to-end tests.   Usage: npm start [-- -p 3000]
 */
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const ROOT = path.resolve("out");
const portFlag = process.argv.indexOf("-p");
const PORT = Number(portFlag > -1 ? process.argv[portFlag + 1] : process.env.PORT || 3000);

if (!existsSync(ROOT)) {
  console.error("No out/ folder: run `npm run build` first.");
  process.exit(1);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

/** Parses Cloudflare's _headers format: a path pattern line, then indented "Name: value" lines. */
function loadHeaderRules() {
  const file = path.join(ROOT, "_headers");
  if (!existsSync(file)) return [];
  const rules = [];
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: {} });
    else if (rules.length) {
      const i = line.indexOf(":");
      rules.at(-1).headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return rules.map((r) => ({
    test: new RegExp(
      "^" + r.pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$",
    ),
    headers: r.headers,
  }));
}
const headerRules = loadHeaderRules();

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [clean, clean + ".html", path.join(clean, "index.html")];
  for (const c of candidates) {
    const full = path.join(ROOT, c);
    if (full.startsWith(ROOT) && existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

createServer((req, res) => {
  const urlPath = (req.url || "/").split("?")[0];
  for (const rule of headerRules) {
    if (rule.test.test(urlPath))
      for (const [k, v] of Object.entries(rule.headers)) res.setHeader(k, v);
  }
  if (urlPath === "/_headers") {
    res.writeHead(404).end();
    return;
  }
  let file = resolveFile(urlPath);
  let status = 200;
  if (!file) {
    file = path.join(ROOT, "404.html");
    status = 404;
  }
  res.writeHead(status, {
    "Content-Type": TYPES[path.extname(file)] || "application/octet-stream",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Golden Bite (built site) on http://localhost:${PORT}`));
