"use client";

import Link from "next/link";
import { useState } from "react";
import type { Stage } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { honestStreak, shiftDay, todayKey, useStore, type Checkin, type Walk } from "@/lib/store";
import type { Step } from "@/lib/journey";
import { createInvite, joinWithCode, leavePartnership, markNotesRead, sendNote, usePartner, type Note } from "@/lib/partner";
import { covenant, encouragementStarters, weeklyQuestions } from "@/content/together";
import { SetupNotice } from "./AccountView";
import { Reveal } from "./Section";
import { IconArrow, IconCheck } from "./Icons";

const walkColor: Record<Walk | "none", string> = {
  walked: "bg-olive",
  wavered: "bg-dawn",
  fell: "bg-clay",
  na: "bg-night/15",
  none: "bg-night/10",
};
const rank: Record<Walk, number> = { na: 0, walked: 1, wavered: 2, fell: 3 };
const worst = (...w: Walk[]) => w.reduce((a, b) => (rank[b] > rank[a] ? b : a), "na" as Walk);

function WeekDots({ byDay }: { byDay: Record<string, Walk> }) {
  const days = Array.from({ length: 14 }).map((_, i) => shiftDay(todayKey(), -(13 - i)));
  return (
    <div className="flex gap-1.5" role="img" aria-label="Last fourteen days of check-ins">
      {days.map((d) => (
        <span
          key={d}
          title={`${d}: ${byDay[d] ?? "no check-in"}`}
          className={`h-5 w-5 rounded-full ${walkColor[byDay[d] ?? "none"]}`}
        />
      ))}
    </div>
  );
}

function Journey({
  title,
  sealed,
  stages,
  steps,
  streak,
  byDay,
  accent,
}: {
  title: string;
  sealed: Set<string>;
  stages: Stage[];
  steps: Step[];
  streak: number;
  byDay: Record<string, Walk>;
  accent: string;
}) {
  return (
    <div className="paper px-5 py-6">
      <p className="eyebrow" style={{ color: accent }}>
        {title}
      </p>
      <p className="mt-1 font-display text-4xl">
        {sealed.size} <span className="text-xl text-night/70">of {steps.length} steps sealed</span>
      </p>
      <ul className="mt-4 grid grid-cols-4 gap-2" aria-label="Stages">
        {stages.map((st) => {
          const total = steps.filter((s) => s.stage === st.id).length;
          const done = steps.filter((s) => s.stage === st.id && sealed.has(s.id)).length;
          const complete = total > 0 && done === total;
          return (
            <li
              key={st.id}
              title={`${st.name}: ${done} of ${total}`}
              className={`rounded-xl px-1 py-2 text-center text-[0.7rem] font-semibold leading-tight ${
                complete ? "bg-olive text-white" : done > 0 ? "bg-dawn/50 text-night" : "bg-night/5 text-night/70"
              }`}
            >
              {st.name}
              <span className="block text-[0.65rem] font-normal opacity-80">
                {done}/{total || "\u2013"}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm font-semibold text-night/70">Last 14 days</p>
      <div className="mt-2">
        <WeekDots byDay={byDay} />
      </div>
      <p className="mt-4 text-sm text-night/70">
        {streak > 0 ? `${streak} honest ${streak === 1 ? "day" : "days"} in a row` : "No check-in streak yet"}
      </p>
    </div>
  );
}

function NoteCard({ n, mine }: { n: Note; mine: boolean }) {
  const label = n.kind === "prayer" ? "Prayer request" : n.kind === "sos" ? "Needed you" : "Encouragement";
  return (
    <li
      className={`rounded-2xl px-4 py-3 ${
        n.kind === "sos" ? "bg-clay/20" : mine ? "bg-night/5" : "bg-dawn/25"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-night/70">
        {mine ? "You" : "Your friend"} &middot; {label} &middot; {new Date(n.created_at).toLocaleDateString()}
      </p>
      <p className="mt-1 text-night/90">{n.body}</p>
    </li>
  );
}

export function PartnerView({ stages, steps }: { stages: Stage[]; steps: Step[] }) {
  const { enabled, loading: authLoading, user } = useAuth();
  const { state } = useStore();
  const { bundle, error, loading, refresh } = usePartner();
  const [joinCode, setJoinCode] = useState("");
  const [msg, setMsg] = useState("");
  const [kind, setKind] = useState<Note["kind"]>("encouragement");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setErr(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const mySealed = new Set(Object.entries(state.milestones).filter(([, p]) => p.sealed).map(([id]) => id));
  const myByDay: Record<string, Walk> = Object.fromEntries(
    Object.values(state.checkins).map((c: Checkin) => [c.date, worst(c.mind, c.purity, c.substances)]),
  );

  const guide = (
    <Reveal className="mt-12 grid gap-6 lg:grid-cols-2">
      <div className="paper px-6 py-7">
        <p className="eyebrow">Our covenant</p>
        <h2 className="mt-1 text-3xl">Five promises for walking together</h2>
        <ol className="mt-4 space-y-4">
          {covenant.map((c, i) => (
            <li key={c.title} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dawn/40 font-display text-lg font-bold">
                {i + 1}
              </span>
              <span>
                <strong className="block text-night">{c.title}</strong>
                <span className="text-[0.97rem] text-night/75">{c.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="night-panel stars px-6 py-7">
        <p className="eyebrow !text-dawn">Once a week</p>
        <h2 className="mt-1 text-3xl">Five questions to ask each other</h2>
        <p className="mt-2 text-sm text-linen/75">Ten minutes. Phone off. Start with a prayer, end with a prayer.</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-linen/90 marker:text-dawn">
          {weeklyQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-linen/65">
          &ldquo;Confess your faults one to another, and pray one for another, that ye may be healed.&rdquo; James 5:16
        </p>
      </div>
    </Reveal>
  );

  if (!enabled) {
    return (
      <>
        <SetupNotice />
        {guide}
      </>
    );
  }

  if (authLoading) return <p className="text-night/70">Checking who you are&hellip;</p>;

  if (!user) {
    return (
      <>
        <div className="paper px-6 py-8 text-center">
          <h2 className="text-3xl">Sign in to walk with your friend</h2>
          <p className="mx-auto mt-2 max-w-md text-night/75">
            Create your account, then make an invite code and send it to the friend you are doing this journey with.
          </p>
          <Link href="/login" className="btn btn-gold mt-6">
            Sign in <IconArrow width={18} height={18} />
          </Link>
        </div>
        {guide}
      </>
    );
  }

  const partnership = bundle?.partnership ?? null;
  const partner = bundle?.partner ?? null;

  return (
    <>
      {error && (
        <p className="mb-4 rounded-xl bg-clay/15 px-4 py-3 text-sm text-clay-deep">
          Could not load just now: {error}. Check that the database setup has been run (see README).
        </p>
      )}
      {err && <p className="mb-4 rounded-xl bg-clay/15 px-4 py-3 text-sm text-clay-deep">{err}</p>}

      {!bundle && loading && <p className="text-night/70">Loading your journey together&hellip;</p>}

      {bundle && !partnership && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="paper px-6 py-7">
            <p className="eyebrow">Start here</p>
            <h2 className="mt-1 text-3xl">Invite your friend</h2>
            <p className="mt-2 text-night/75">
              Make a code and send it to them. When they enter it, you are paired.
            </p>
            <button className="btn btn-gold mt-5" disabled={busy} onClick={() => run(createInvite)}>
              Create my invite code
            </button>
          </div>
          <div className="paper px-6 py-7">
            <p className="eyebrow">Or</p>
            <h2 className="mt-1 text-3xl">I have a code</h2>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                run(() => joinWithCode(joinCode));
              }}
            >
              <label htmlFor="code" className="sr-only">
                Invite code
              </label>
              <input
                id="code"
                className="field text-center font-display text-3xl uppercase tracking-[0.3em]"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                autoComplete="off"
              />
              <button className="btn btn-night mt-4" disabled={busy || joinCode.length < 6}>
                Join my friend
              </button>
            </form>
          </div>
        </div>
      )}

      {partnership?.status === "pending" && (
        <div className="night-panel stars px-6 py-10 text-center">
          <p className="eyebrow !text-dawn">Your invite code</p>
          <p className="mt-3 font-display text-6xl tracking-[0.25em] text-dawn-pale" aria-label={`Code ${partnership.code.split("").join(" ")}`}>
            {partnership.code}
          </p>
          <p className="mx-auto mt-4 max-w-md text-linen/80">
            Send this to your friend. They sign in, open <strong>Together</strong>, and enter it. This page updates once
            they join.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              className="btn btn-gold"
              onClick={async () => {
                const text = `Join me on the Journey to Purity. Sign in, open Together, and use my code: ${partnership.code}  ${window.location.origin}/partner`;
                if (navigator.share) {
                  try {
                    await navigator.share({ text });
                    return;
                  } catch {
                    /* cancelled */
                  }
                }
                await navigator.clipboard?.writeText(text);
                setMsg("Copied. Paste it in a message to your friend.");
              }}
            >
              Share the code
            </button>
            <button className="btn btn-ghost-light" onClick={() => refresh()}>
              Check if they joined
            </button>
          </div>
          {msg && <p className="mt-3 text-sm text-dawn-pale">{msg}</p>}
          <button className="mt-6 text-sm text-linen/60 underline underline-offset-4" onClick={() => run(leavePartnership)}>
            Cancel this invite
          </button>
        </div>
      )}

      {partnership?.status === "active" && partner && (
        <div className="space-y-10">
          <Reveal>
            <p className="eyebrow">Together</p>
            <h2 className="mt-1 text-4xl sm:text-5xl">
              You and {partner.name || "your friend"}
            </h2>
            <p className="mt-2 text-night/70">Two journeys, one road. This refreshes when you come back to the page.</p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Journey
              title="You"
              sealed={mySealed}
              stages={stages}
              steps={steps}
              streak={honestStreak(state.checkins)}
              byDay={myByDay}
              accent="#8a5a17"
            />
            <Journey
              title={partner.name || "Your friend"}
              sealed={new Set(partner.sealed)}
              stages={stages}
              steps={steps}
              streak={(() => {
                const days = new Set(partner.checkins.map((c) => c.day));
                let key = todayKey();
                if (!days.has(key)) key = shiftDay(key, -1);
                let n = 0;
                while (days.has(key)) {
                  n++;
                  key = shiftDay(key, -1);
                }
                return n;
              })()}
              byDay={Object.fromEntries(partner.checkins.map((c) => [c.day, worst(c.mind, c.purity, c.substances)]))}
              accent="#55663f"
            />
          </div>
          <p className="-mt-6 text-xs text-night/70">
            <span className="mr-3 inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-olive" /> walked</span>
            <span className="mr-3 inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-dawn" /> wavered</span>
            <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-clay" /> fell, and was honest</span>
          </p>

          <Reveal className="grid gap-6 lg:grid-cols-2">
            <div className="paper px-6 py-7">
              <p className="eyebrow">Send something</p>
              <h3 className="mt-1 text-3xl">A word for {partner.name || "your friend"}</h3>
              <div className="mt-4 flex gap-2" role="radiogroup" aria-label="Kind of note">
                {(["encouragement", "prayer"] as const).map((k) => (
                  <button
                    key={k}
                    role="radio"
                    aria-checked={kind === k}
                    onClick={() => setKind(k)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-500 ${
                      kind === k ? "bg-night text-dawn-pale" : "bg-night/5 text-night/70"
                    }`}
                  >
                    {k === "encouragement" ? "Encouragement" : "Prayer request"}
                  </button>
                ))}
              </div>
              <label htmlFor="note" className="sr-only">
                Your note
              </label>
              <textarea
                id="note"
                className="field mt-3 min-h-28"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={kind === "prayer" ? "How can they pray for you?" : "Write something that would lift you up to read."}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {encouragementStarters.map((s) => (
                  <button key={s} className="rounded-full bg-dawn/25 px-3 py-1 text-xs text-night/80" onClick={() => setNote(s)}>
                    {s.length > 34 ? s.slice(0, 34) + "\u2026" : s}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-gold mt-4"
                disabled={busy || !note.trim()}
                onClick={() =>
                  run(async () => {
                    await sendNote(partnership.partnerId as string, kind, note.trim());
                    setNote("");
                  })
                }
              >
                Send <IconCheck width={18} height={18} />
              </button>
            </div>

            <div className="paper px-6 py-7">
              <p className="eyebrow">Notes</p>
              <h3 className="mt-1 text-3xl">Between you two</h3>
              {bundle && bundle.notes.length > 0 ? (
                <>
                  <ul className="mt-4 max-h-96 space-y-3 overflow-auto pr-1">
                    {bundle.notes.map((n) => (
                      <NoteCard key={n.id} n={n} mine={n.from_user === user.id} />
                    ))}
                  </ul>
                  {bundle.notes.some((n) => n.to_user === user.id && !n.read_at) && (
                    <button
                      className="mt-3 text-sm underline underline-offset-4"
                      onClick={() =>
                        run(() =>
                          markNotesRead(bundle.notes.filter((n) => n.to_user === user.id && !n.read_at).map((n) => n.id)),
                        )
                      }
                    >
                      Mark all as read
                    </button>
                  )}
                </>
              ) : (
                <p className="mt-3 text-night/65">Nothing yet. Send the first word.</p>
              )}
            </div>
          </Reveal>

          {partner.journal.length > 0 && (
            <Reveal>
              <p className="eyebrow">Shared with you</p>
              <h3 className="mt-1 text-3xl">What {partner.name || "your friend"} chose to share</h3>
              <ul className="mt-4 space-y-3">
                {partner.journal.map((j) => (
                  <li key={j.id} className="paper px-5 py-4">
                    {j.prompt && <p className="font-display text-xl italic text-night/70">{j.prompt}</p>}
                    <p className="mt-1 whitespace-pre-wrap font-scripture">{j.body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          <div className="text-sm text-night/70">
            {confirmLeave ? (
              <span>
                Leave this partnership? Your friend will no longer see your progress.{" "}
                <button className="font-semibold text-clay-deep underline" onClick={() => run(leavePartnership)}>
                  Yes, leave
                </button>{" "}
                <button className="underline" onClick={() => setConfirmLeave(false)}>
                  Stay
                </button>
              </span>
            ) : (
              <button className="underline underline-offset-4" onClick={() => setConfirmLeave(true)}>
                Leave this partnership
              </button>
            )}
          </div>
        </div>
      )}

      {guide}
    </>
  );
}
