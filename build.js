#!/usr/bin/env node
// =============================================================
// UNCENSORED TRANSLATOR — BUILD / ASSEMBLY SCRIPT
// Assembles the single self-contained index.html from sources:
//   ui.html  (template with two injection markers)
//   + styles.css  -> injected into <style> block
//   + dict_part1.js + dict_part2.js + engine.js + ui.js -> injected into <script> block
//
// Usage:  node build.js
// Output: index.html  (written to the same directory)
// =============================================================

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

const TEMPLATE = "ui.html";
const CSS_SRC = "styles.css";
const JS_SRCS = ["dict_part1.js", "dict_part2.js", "engine.js", "ui.js"];
const OUT = "index.html";

const CSS_MARKER = "/* CSS injected here in the final assembled file */";
const JS_MARKER = "/* JS injected here in the final assembled file */";

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}

const tpl = read(TEMPLATE);
const css = read(CSS_SRC);
const js = JS_SRCS.map(read).join("\n;\n");

if (!tpl.includes(CSS_MARKER)) {
  console.error(`ERROR: CSS marker not found in ${TEMPLATE}`);
  process.exit(1);
}
if (!tpl.includes(JS_MARKER)) {
  console.error(`ERROR: JS marker not found in ${TEMPLATE}`);
  process.exit(1);
}

const out = tpl
  .replace(CSS_MARKER, css)
  .replace(JS_MARKER, js);

fs.writeFileSync(path.join(ROOT, OUT), out, "utf8");

const kb = (Buffer.byteLength(out, "utf8") / 1024).toFixed(1);
console.log(`OK  assembled ${OUT}  (${kb} KB)`);
