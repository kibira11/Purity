// Dev tool: screenshot pages of the running site (npm run dev or npm start on :3000).
// Usage: node scripts/shots.mjs [--seal=egypt-1,egypt-2] [--desktop] [--segs=3] [--from=0] <path> [<path> ...]
// Output: .shots/<name>-<mobile|desktop>-<n>.png  (viewport-sized segments, easy to read)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (name, def) => (args.find((a) => a.startsWith(`--${name}=`)) ?? `--${name}=${def}`).split("=")[1];
const seal = opt("seal", "").split(",").filter(Boolean);
const desktop = args.includes("--desktop");
const segs = Number(opt("segs", 3));
const from = Number(opt("from", 0));
const base = opt("base", "http://localhost:3000");
const paths = args.filter((a) => !a.startsWith("--"));
mkdirSync(".shots", { recursive: true });

const now = new Date().toISOString();
const state = {
  v: 1,
  name: "Test",
  milestones: Object.fromEntries(seal.map((id) => [id, { gameWon: true, sealed: true, updatedAt: now }])),
  checkins: {},
  journal: {},
  plans: {},
  stonesSeen: [],
  armor: [],
};

const vp = desktop ? { width: 1280, height: 800 } : { width: 390, height: 844 };
const browser = await chromium.launch();
for (const p of paths) {
  const ctx = await browser.newContext(desktop ? { viewport: vp } : { viewport: vp, deviceScaleFactor: 1.5, isMobile: true });
  await ctx.addInitScript((s) => {
    if (!localStorage.getItem("purity:v1")) localStorage.setItem("purity:v1", JSON.stringify(s));
  }, state);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGE ERROR", p, e.message));
  page.on("console", (m) => m.type() === "error" && console.log("CONSOLE ERROR", p, m.text().slice(0, 1200)));
  await page.goto(base + p, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  const name = (p === "/" ? "home" : p.replace(/^\//, "").replace(/[\/?=&]/g, "_")) + (desktop ? "-desktop" : "-mobile");
  for (let i = from; i < from + segs; i++) {
    const y = Math.round(i * vp.height * 0.92);
    if (y > h) break;
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `.shots/${name}-${i + 1}.png` });
    console.log(`saved .shots/${name}-${i + 1}.png (page height ${h})`);
  }
  await ctx.close();
}
await browser.close();
