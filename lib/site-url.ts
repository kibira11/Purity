/** Canonical public URL (no trailing slash). Set in Cloudflare / Vercel for production auth redirects. */
export function getPublicSiteUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/$/, "");
}

/** Where magic-link sign-in should return the user (must be listed in Supabase Redirect URLs). */
export function authCallbackUrl(): string {
  const path = "/login";
  const base = getPublicSiteUrl();
  if (base) return `${base}${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return path;
}
