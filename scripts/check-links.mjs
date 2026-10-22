// Finds every external URL in content/ and lib/ and checks that it still answers.
// Usage: npm run links
// 2xx/3xx = ok. 403/429/999 = "unverifiable" (the site blocks bots, check by hand). 404/410/network error = dead.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["content", "lib", "app", "components"];

function* walk(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(n)) yield p;
  }
}

const found = new Map(); // url -> [files]
for (const d of dirs) {
  for (const f of walk(join(root, d))) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/https?:\/\/[^\s"'`<>\\]+/g)) {
      let url = m[0].replace(/[.,;]+$/, "");
      // Keep balanced parentheses (Wikipedia titles), drop an unbalanced trailing one.
      while (url.endsWith(")") && (url.match(/\(/g) ?? []).length < (url.match(/\)/g) ?? []).length) url = url.slice(0, -1);
      if (/localhost|example\.com|supabase\.co|w3\.org|\$\{/.test(url)) continue;
      const list = found.get(url) ?? [];
      list.push(relative(root, f));
      found.set(url, list);
    }
  }
}

const UA = "Mozilla/5.0 (compatible; JourneyToPurityLinkCheck/1.0)";

async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    try {
      const res = await fetch(url, { method, redirect: "follow", signal: ctl.signal, headers: { "user-agent": UA } });
      clearTimeout(t);
      if (res.ok) return { status: "ok", code: res.status };
      if ([403, 429, 999].includes(res.status)) return { status: "blocked", code: res.status };
      if (method === "GET" || [404, 410].includes(res.status)) return { status: "dead", code: res.status };
    } catch (e) {
      clearTimeout(t);
      if (method === "GET") return { status: "error", code: e.cause?.code ?? e.name };
    }
  }
  return { status: "error", code: "?" };
}

const urls = [...found.keys()];
console.log(`Checking ${urls.length} links...\n`);
const results = [];
const queue = [...urls];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      results.push({ url, ...(await check(url)) });
    }
  }),
);

const by = (s) => results.filter((r) => r.status === s);
for (const r of [...by("dead"), ...by("error")]) {
  console.log(`DEAD  ${r.code}  ${r.url}\n      in ${[...new Set(found.get(r.url))].join(", ")}`);
}
for (const r of by("blocked")) console.log(`BLOCKED ${r.code} (check by hand)  ${r.url}`);
console.log(`\n${by("ok").length} ok, ${by("blocked").length} blocked, ${by("dead").length + by("error").length} dead`);
process.exitCode = by("dead").length + by("error").length ? 1 : 0;
