"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { studies } from "@/content/studies";
import { useAuth } from "@/lib/auth";
import { cloudEnabled } from "@/lib/supabase";
import {
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  useMyStudyGroup,
} from "@/lib/groups";
import { SetupNotice } from "./AccountView";
import { IconArrow } from "./Icons";

export function GroupsView() {
  const { user, enabled } = useAuth();
  const { group, refresh, loading, error: loadErr } = useMyStudyGroup();
  const params = useSearchParams();
  const preStudy = params.get("study") ?? studies[0].id;
  const [name, setName] = useState("");
  const [studyId, setStudyId] = useState(preStudy);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (!cloudEnabled || !enabled) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12">
        <SetupNotice />
        <p className="mt-6 text-night/75">
          Groups need an account so members can see each other&rsquo;s study progress and discussion. You can still{" "}
          <Link href="/study" className="font-semibold underline">
            study alone
          </Link>{" "}
          without signing in.
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12">
        <p className="eyebrow">Study together</p>
        <h1 className="mt-2 text-4xl">Bible study groups</h1>
        <p className="mt-4 text-night/75">
          Sign in under <Link href="/login" className="font-semibold underline">Account</Link> to create or join a group.
        </p>
        <Link href="/study" className="btn btn-ghost mt-6">
          Study alone instead
        </Link>
      </div>
    );
  }

  const start = async () => {
    setBusy(true);
    setErr(null);
    try {
      const c = await createStudyGroup(name || "Our group", studyId);
      setMessage(`Group created. Share this code: ${c}`);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not create");
    } finally {
      setBusy(false);
    }
  };

  const join = async () => {
    setBusy(true);
    setErr(null);
    try {
      await joinStudyGroup(code);
      setMessage("You are in. Open your group below.");
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not join");
    } finally {
      setBusy(false);
    }
  };

  const leave = async () => {
    if (!group) return;
    setBusy(true);
    try {
      await leaveStudyGroup(group.id);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not leave");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="eyebrow">Online</p>
      <h1 className="mt-2 text-5xl">Study groups</h1>
      <p className="mt-4 text-night/75">
        Up to twelve people, one shared study, discussion per session. Check-ins and private journal stay private.
      </p>

      {(err || loadErr) && <p className="mt-4 text-sm text-clay-deep">{err || loadErr}</p>}
      {message && <p className="mt-4 text-sm font-semibold text-olive-deep">{message}</p>}

      {group ? (
        <div className="paper mt-8 px-6 py-6">
          <p className="font-display text-3xl">{group.name}</p>
          <p className="mt-1 text-sm text-night/70">
            Code <strong>{group.code}</strong> · {group.role === "leader" ? "You lead" : "Member"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/groups/${group.id}`} className="btn btn-gold">
              Open group room <IconArrow width={16} height={16} />
            </Link>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={leave}>
              Leave group
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <FormPanel title="Start a group">
            <label className="block text-sm font-semibold">
              Group name
              <input className="field mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Men at church" />
            </label>
            <label className="mt-3 block text-sm font-semibold">
              Study
              <select className="field mt-1" value={studyId} onChange={(e) => setStudyId(e.target.value)}>
                {studies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn btn-gold mt-4" disabled={busy || loading} onClick={start}>
              Create invite code
            </button>
          </FormPanel>
          <FormPanel title="I have a code">
            <input
              className="field"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              autoComplete="off"
            />
            <button type="button" className="btn btn-night mt-4" disabled={busy || !code.trim()} onClick={join}>
              Join group
            </button>
          </FormPanel>
        </div>
      )}

      <p className="mt-10 text-sm text-night/65">
        Prefer your own pace?{" "}
        <Link href="/study" className="font-semibold underline">
          Study alone
        </Link>
        .
      </p>
    </div>
  );
}

function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="paper px-6 py-6">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}