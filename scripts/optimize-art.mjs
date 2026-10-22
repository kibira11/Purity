// Shrinks the artwork in public/art so pages load fast on phones.
// Usage: node scripts/optimize-art.mjs
// - Resizes anything wider than 1600px, re-encodes as a progressive JPEG (quality 80).
// - Only replaces a file when the result is smaller. Safe to run more than once.

import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "art");
const MAX_W = 1600;

let before = 0;
let after = 0;
for (const f of readdirSync(dir).filter((n) => /\.(jpe?g|png)$/i.test(n))) {
  const p = join(dir, f);
  const src = readFileSync(p);
  before += statSync(p).size;
  const img = sharp(src, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  const out = await img
    .resize({ width: Math.min(meta.width ?? MAX_W, MAX_W), withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();
  if (out.length < src.length) {
    writeFileSync(p, out);
    after += out.length;
    console.log(`${f}: ${Math.round(src.length / 1024)} KB -> ${Math.round(out.length / 1024)} KB`);
  } else {
    after += src.length;
    console.log(`${f}: kept (${Math.round(src.length / 1024)} KB)`);
  }
}
console.log(`\nTotal: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`);
