// Dev tool: print full console errors for a page. Usage: node scripts/console-errors.mjs /journey
import { chromium } from "playwright";
const path = process.argv[2] ?? "/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("console", (m) => m.type() === "error" && console.log("CONSOLE ERROR\n" + m.text()));
page.on("pageerror", (e) => console.log("PAGE ERROR", e.message));
await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await browser.close();
