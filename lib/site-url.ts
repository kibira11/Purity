/** Live Workers host (used when build env was not set on Cloudflare). */
export const DEPLOYED_SITE_URL = "https://journey-to-purity.kenkibira11.workers.dev";

function isLocalOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

/** Canonical public URL (no trailing slash). Set in Cloudflare / Vercel for production auth redirects. */
export function getPublicSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    const url = raw.replace(/\/$/, "");
    if (process.env.NODE_ENV === "production" && isLocalOrigin(url)) return DEPLOYED_SITE_URL;
    return url;
  }
  if (process.env.NODE_ENV === "production") return DEPLOYED_SITE_URL;
  return undefined;
}

/** Where magic-link sign-in should return the user (must be listed in Supabase Redirect URLs). */
export function authCallbackUrl(): string {
  const path = "/login";
  // Live site wins over build-time env (avoids localhost baked into Cloudflare / .env.local).
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (!isLocalOrigin(origin)) return `${origin}${path}`;
  }
  const base = getPublicSiteUrl();
  if (base) return `${base}${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return path;
}
