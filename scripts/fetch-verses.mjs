// Fetches KJV and WEB (both public domain) for every scripture reference used in /content.
// Usage: npm run verses
// - Finds any string literal in content/**/*.ts whose ENTIRE value is a reference, e.g. "Matthew 5:8".
// - Caches results in content/verses.json and only fetches what is missing.
// - bible-api.com allows ~15 requests per 30s, so this paces itself.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const outFile = join(contentDir, "verses.json");

const REF = /"((?:[1-3] )?[A-Z][A-Za-z]+(?: of [A-Z][a-z]+)? \d+:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)"/g;

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".ts") ? [p] : [];
  });
}

const refs = new Set();
for (const file of walk(contentDir)) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(REF)) refs.add(m[1]);
}

const cache = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : {};
const todo = [...refs].filter((r) => !cache[r]?.kjv || !cache[r]?.web).sort();
console.log(`${refs.size} references found, ${todo.length} to fetch.`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(ref, tr) {
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=${tr}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url);
    if (res.status === 429 || res.status >= 500) {
      console.log(`  ${res.status} on ${ref} (${tr}), waiting...`);
      await sleep(20000);
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} for ${ref} (${tr})`);
    const json = await res.json();
    return String(json.text).replace(/\s+/g, " ").trim();
  }
  throw new Error(`gave up on ${ref} (${tr})`);
}

const failed = [];
let n = 0;
for (const ref of todo) {
  n++;
  try {
    const entry = cache[ref] ?? {};
    if (!entry.kjv) {
      entry.kjv = await get(ref, "kjv");
      await sleep(2200);
    }
    if (!entry.web) {
      entry.web = await get(ref, "web");
      await sleep(2200);
    }
    cache[ref] = entry;
    const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
    writeFileSync(outFile, JSON.stringify(sorted, null, 2) + "\n");
    console.log(`[${n}/${todo.length}] ${ref}`);
  } catch (e) {
    console.log(`FAILED ${ref}: ${e.message}`);
    failed.push(ref);
  }
}

if (failed.length) {
  console.log(`\n${failed.length} failed:\n${failed.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log("\nAll verses cached.");
}
