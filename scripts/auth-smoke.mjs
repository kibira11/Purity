/**
 * Auth smoke tests: Supabase reachability + login UI.
 * Usage: npm run dev (another terminal), then npm run auth-smoke
 * Env: reads .env.local; AUTH_SMOKE_URL defaults to http://localhost:3000
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const envPath = join(root, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

const env = { ...loadEnvFile(join(root, ".env.production")), ...loadEnvFile(envPath) };
const url = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
async function pickDevUrl() {
  if (process.env.AUTH_SMOKE_URL) return process.env.AUTH_SMOKE_URL.replace(/\/$/, "");
  for (const port of [3000, 3001, 3002]) {
    const origin = `http://localhost:${port}`;
    try {
      const r = await fetch(origin, { signal: AbortSignal.timeout(1500) });
      if (r.ok) return origin;
    } catch {
      /* try next port */
    }
  }
  return "http://localhost:3000";
}

const base = await pickDevUrl();

let failed = 0;
const ok = (msg) => console.log(`✓ ${msg}`);
const bad = (msg) => {
  console.error(`✗ ${msg}`);
  failed++;
};

if (!url || !key) {
  bad("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required (.env.local)");
} else {
  try {
    const health = await fetch(`${url}/auth/v1/health`);
    if (health.status === 401 || health.ok) ok(`Supabase auth health (${health.status})`);
    else bad(`Supabase health unexpected status ${health.status}`);
  } catch (e) {
    bad(`Supabase unreachable: ${e instanceof Error ? e.message : e}`);
  }

  try {
    const otp = await fetch(`${url}/auth/v1/otp`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `smoke-${Date.now()}@mailinator.com`,
        create_user: true,
      }),
    });
    if (otp.ok) ok("Magic link OTP endpoint accepts requests");
    else if (otp.status === 429) ok("Magic link OTP reachable (rate limited — still counts as connected)");
    else bad(`OTP endpoint status ${otp.status}: ${(await otp.text()).slice(0, 120)}`);
  } catch (e) {
    bad(`OTP request failed: ${e instanceof Error ? e.message : e}`);
  }
}

const skipUi = process.env.AUTH_SMOKE_SKIP_UI === "1";

async function uiSmoke() {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ timeout: 30_000 });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const loginUrl = `${base}/login`;
  const res = await page.goto(loginUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  if (!res || !res.ok()) bad(`Could not load ${loginUrl} (${res?.status() ?? "no response"})`);
  else {
    const body = await page.textContent("body");
    if (body?.includes("Online accounts are not connected yet")) {
      bad("Login page shows SetupNotice — Supabase env vars missing in this build");
    } else {
      const google = page.getByRole("button", { name: /continue with google/i });
      const emailBtn = page.getByRole("button", { name: /send me the link/i });
      if (await google.isVisible().catch(() => false)) ok("Continue with Google visible");
      else bad("Continue with Google not found on /login");
      if (await emailBtn.isVisible().catch(() => false)) ok("Email magic link form visible");
      else bad("Send me the link button not found");
    }
  }
  await browser.close();
}

if (skipUi) {
  ok("UI smoke skipped (AUTH_SMOKE_SKIP_UI=1)");
} else {
  try {
    await Promise.race([
      uiSmoke(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("UI smoke timed out after 90s")), 90_000)),
    ]);
  } catch (e) {
    bad(`UI smoke failed (${e instanceof Error ? e.message : e}). Is \`npm run dev\` running? Try AUTH_SMOKE_URL=http://localhost:3001`);
  }
}

if (failed) {
  console.error(`\nAuth smoke: ${failed} failure(s)`);
  process.exit(1);
}
console.log("\nAuth smoke passed.");