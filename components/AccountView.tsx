"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { useSyncStatus } from "@/lib/sync";
import { IconArrow } from "./Icons";

export function SetupNotice() {
  return (
    <div className="paper px-6 py-7">
      <p className="eyebrow">Online accounts are not connected yet</p>
      <h2 className="mt-2 text-3xl">Right now your journey saves on this device</h2>
      <p className="mt-3 text-night/80">
        Everything works here: the journey, check-ins, journal, games. To walk <strong>together online</strong> (see each
        other&rsquo;s progress, send encouragement, sync across phones), connect a free Supabase project. It takes about ten
        minutes, and the steps are in <code className="rounded bg-night/5 px-1.5 py-0.5 text-sm">README.md</code> under
        &ldquo;Connect accounts&rdquo;.
      </p>
    </div>
  );
}

export function AccountView() {
  const { enabled, loading, user, sendLink, signOut } = useAuth();
  const { state, act } = useStore();
  const sync = useSyncStatus();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await sendLink(email);
    setBusy(false);
    if (res.error) setErr(res.error);
    else setSent(true);
  };

  if (!enabled) return <SetupNotice />;
  if (loading) return <p className="text-night/70">Checking who you are&hellip;</p>;

  if (user) {
    return (
      <div className="space-y-6">
        <div className="paper px-6 py-7">
          <p className="eyebrow">Signed in</p>
          <h2 className="mt-2 break-all text-3xl">{user.email}</h2>
          <p className="mt-2 text-sm text-night/65" aria-live="polite">
            {sync.phase === "syncing" && "Syncing\u2026"}
            {sync.phase === "synced" && "Saved to your account and this device."}
            {sync.phase === "error" && (
              <span className="text-clay-deep">
                Could not reach your account just now ({sync.message}). Your journey is still saved on this device.
              </span>
            )}
            {(sync.phase === "idle" || sync.phase === "off") && "Ready."}
          </p>

          <label htmlFor="display-name" className="mt-6 block text-sm font-semibold text-night">
            What should your friend call you?
          </label>
          <input
            id="display-name"
            className="field mt-2 max-w-sm"
            value={state.name}
            onChange={(e) => act({ type: "setName", name: e.target.value })}
            placeholder="Your first name"
            autoComplete="given-name"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/partner" className="btn btn-gold">
              Go to Together <IconArrow width={18} height={18} />
            </Link>
            <button className="btn btn-ghost" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper px-6 py-7">
      <p className="eyebrow">Sign in with a link</p>
      <h2 className="mt-2 text-3xl">No password. Just your email.</h2>
      <p className="mt-2 text-night/75">
        We will email you a one-tap link. The first time creates your account. Your private journal stays private,
        enforced by the database itself.
      </p>
      {sent ? (
        <div className="mt-6 rounded-2xl bg-olive/15 px-5 py-4 text-night" role="status">
          <p className="font-semibold">Check your email.</p>
          <p className="text-sm text-night/75">
            Open the link on this device. It will bring you back here, signed in.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 max-w-md">
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="field mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
          {err && <p className="mt-2 text-sm text-clay-deep">{err}</p>}
          <button className="btn btn-gold mt-4" disabled={busy}>
            {busy ? "Sending\u2026" : "Send me the link"}
          </button>
        </form>
      )}
      <p className="mt-6 text-sm text-night/70">
        Prefer not to sign in? Everything still works, saved on this device only.
      </p>
    </div>
  );
}
