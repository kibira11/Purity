// Dev tool: run axe-core on pages of the running site (npm run dev or npm start on :3000).
// Usage: node scripts/a11y.mjs [--desktop] <path> [<path> ...]
// Prints violations (serious/critical first) with the offending selectors.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const args = process.argv.slice(2);
const desktop = args.includes("--desktop");
const paths = args.filter((a) => !a.startsWith("--"));
const base = (args.find((a) => a.startsWith("--base=")) ?? "--base=http://localhost:3000").split("=")[1];

const browser = await chromium.launch();
let total = 0;
for (const p of paths) {
  const ctx = await browser.newContext(desktop ? { viewport: { width: 1280, height: 800 } } : { viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500); // let reveal animations finish so contrast is measured on settled colors
  await page.evaluate(axeSource);
  const res = await page.evaluate(() =>
    // eslint-disable-next-line no-undef
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }),
  );
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const v = res.violations.sort((a, b) => order[a.impact] - order[b.impact]);
  console.log(`\n== ${p}: ${v.length} violation type(s)`);
  for (const x of v) {
    total += x.nodes.length;
    console.log(`  [${x.impact}] ${x.id}: ${x.help} (${x.nodes.length})`);
    for (const n of x.nodes.slice(0, 3)) {
      console.log(`      ${n.target.join(" ")}`);
      if (x.id === "color-contrast") console.log(`      ${(n.any[0]?.message ?? "").slice(0, 160)}`);
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\nTotal offending nodes: ${total}`);
