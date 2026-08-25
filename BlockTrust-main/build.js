// ============================================================
// BLOCKTRUST — BUILD SCRIPT
// Assembles src/*.js + src/styles.css into a single index.html
// Usage: node build.js
// ============================================================

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const TEMPLATE = path.join(ROOT, "ui.html");
const OUT = path.join(ROOT, "index.html");

function read(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${p}`);
  return fs.readFileSync(p, "utf8");
}

function strip(src) {
  // Remove leading comment banner block lines but keep code intact.
  // We keep everything — just trim trailing whitespace.
  return src.replace(/\s+$/, "") + "\n";
}

function build() {
  console.log("🔨 Building BlockTrust...\n");

  let html = read(TEMPLATE);

  const css = read(path.join(SRC, "styles.css"));
  const data = read(path.join(SRC, "data.js"));
  const store = read(path.join(SRC, "store.js"));
  const util = read(path.join(SRC, "util.js"));
  const render = read(path.join(SRC, "render.js"));
  const ui = read(path.join(SRC, "ui.js"));

  // Inject CSS
  html = html.replace("/* __STYLES__ */", css.trim());

  // Inject JS modules in dependency order
  html = html.replace("/* __DATA__ */", strip(data));
  html = html.replace("/* __STORE__ */", strip(store));
  html = html.replace("/* __UTIL__ */", strip(util));
  html = html.replace("/* __RENDER__ */", strip(render));
  html = html.replace("/* __UI__ */", strip(ui));

  // Write
  fs.writeFileSync(OUT, html, "utf8");

  const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  const lines = html.split("\n").length;
  console.log(`✅ Built index.html — ${kb} KB, ${lines} lines`);
  console.log(`   Sources: data.js, store.js, util.js, render.js, ui.js, styles.css`);
  console.log(`   Output:  ${path.relative(process.cwd(), OUT)}\n`);
}

try {
  build();
} catch (e) {
  console.error("❌ Build failed:", e.message);
  process.exit(1);
}
