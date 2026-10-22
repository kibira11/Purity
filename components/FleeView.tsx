"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VerseData } from "@/lib/verses";
import { usePartner, sendNote } from "@/lib/partner";
import { useAuth } from "@/lib/auth";
import { Verse } from "./Verse";
import { IconArrow } from "./Icons";

/* ------------------------------------------------------------------ */
/* Breathing: 4 in, 7 hold, 8 out                                      */
/* ------------------------------------------------------------------ */

const PHASES = [
  { label: "Breathe in", secs: 4 },
  { label: "Hold", secs: 7 },
  { label: "Breathe out", secs: 8 },
] as const;
const CYCLE = PHASES.reduce((a, p) => a + p.secs, 0);
const CYCLES = 4;

function Breathing() {
  const reduce = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [t, setT] = useState(0);
  const start = useRef(0);

  useEffect(() => {
    if (!running) return;
    start.current = performance.now() - t * 1000;
    const id = window.setInterval(() => {
      const el = (performance.now() - start.current) / 1000;
      if (el >= CYCLE * CYCLES) {
        setT(0);
        setRunning(false);
      } else setT(el);
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const inCycle = t % CYCLE;
  let phaseIdx = 0;
  let acc = 0;
  for (let i = 0; i < PHASES.length; i++) {
    if (inCycle < acc + PHASES[i].secs) {
      phaseIdx = i;
      break;
    }
    acc += PHASES[i].secs;
  }
  const within = inCycle - acc;
  const remaining = Math.ceil(PHASES[phaseIdx].secs - within);
  const progress = phaseIdx === 0 ? within / 4 : phaseIdx === 1 ? 1 : 1 - within / 8;
  const scale = 0.55 + 0.45 * Math.max(0, Math.min(1, progress));
  const cycleNo = Math.min(CYCLES, Math.floor(t / CYCLE) + 1);

  return (
    <div className="text-center">
      <div className="relative mx-auto flex h-60 w-60 items-center justify-center" aria-live="polite">
        <div
          className="absolute inset-0 rounded-full bg-dawn/15"
          style={{
            transform: `scale(${running && !reduce ? scale : 0.8})`,
            transition: "transform 0.12s linear",
          }}
        />
        <div
          className="absolute inset-6 rounded-full border border-dawn/60"
          style={{
            transform: `scale(${running && !reduce ? scale : 0.8})`,
            transition: "transform 0.12s linear",
          }}
        />
        <div className="relative">
          <p className="font-display text-3xl text-dawn-pale">{running ? PHASES[phaseIdx].label : "Ready"}</p>
          {running && <p className="mt-1 text-4xl font-semibold text-linen">{remaining}</p>}
        </div>
      </div>
      <p className="mt-2 text-sm text-linen/70">
        {running ? `Round ${cycleNo} of ${CYCLES}` : `${CYCLES} rounds, about ${Math.round((CYCLE * CYCLES) / 60)} minute`}
      </p>
      <button className="btn btn-gold mt-4" onClick={() => setRunning((r) => !r)}>
        {running ? "Pause" : t > 0 ? "Resume" : "Start breathing"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Urge surfing: ten minutes, rate the wave                            */
/* ------------------------------------------------------------------ */

const TOTAL = 10 * 60;

function Surf() {
  const [running, setRunning] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const [level, setLevel] = useState(7);
  const [log, setLog] = useState<{ at: number; level: number }[]>([]);
  const done = left === 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const elapsed = TOTAL - left;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const addLog = () => setLog((l) => [...l, { at: elapsed, level }]);

  const first = log[0];
  const last = log[log.length - 1];
  const dropped = first && last && log.length > 1 && last.level < first.level;

  const points = useMemo(() => {
    if (log.length < 2) return "";
    return log
      .map((p) => `${(p.at / TOTAL) * 280 + 10},${10 + (1 - (p.level - 1) / 9) * 70}`)
      .join(" ");
  }, [log]);

  return (
    <div>
      <p className="text-center font-display text-6xl tabular-nums text-dawn-pale">
        {mm}:{ss}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          className="btn btn-gold"
          onClick={() => {
            if (done) {
              setLeft(TOTAL);
              setLog([]);
            }
            setRunning((r) => !r);
          }}
        >
          {done ? "Go again" : running ? "Pause" : elapsed > 0 ? "Resume" : "Start the ten minutes"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-white/5 p-4">
        <label htmlFor="level" className="block text-sm font-semibold text-linen">
          How strong is it right now? <span className="text-dawn-pale">{level} / 10</span>
        </label>
        <input
          id="level"
          type="range"
          min={1}
          max={10}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="mt-3 w-full accent-[#e8b86d]"
        />
        <button className="btn btn-ghost-light mt-3 !min-h-0 !py-2" onClick={addLog}>
          Log it
        </button>
        {log.length > 1 && (
          <svg viewBox="0 0 300 90" className="mt-4 w-full" role="img" aria-label="Your cravings over time">
            <line x1="10" y1="80" x2="290" y2="80" stroke="rgba(247,241,230,0.2)" />
            <polyline points={points} fill="none" stroke="#e8b86d" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            {log.map((p) => (
              <circle key={p.at + "-" + p.level} cx={(p.at / TOTAL) * 280 + 10} cy={10 + (1 - (p.level - 1) / 9) * 70} r="4" fill="#f4d596" />
            ))}
          </svg>
        )}
        {dropped && (
          <p className="mt-3 text-sm text-dawn-pale">
            Look at that line. It peaked and it fell, and you did not have to obey it.
          </p>
        )}
      </div>
      <p className="mt-4 text-sm text-linen/70">
        Notice where you feel it: chest, stomach, hands. Name it quietly: <em>this is a wave</em>. You are not the wave.
        You are the one watching it. Most cravings fade within 15 to 30 minutes if you do not feed them.
      </p>
      {done && <p className="mt-3 font-display text-2xl text-dawn-pale">Ten minutes. You rode it.</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tell someone                                                        */
/* ------------------------------------------------------------------ */

const DEFAULT_SOS = "I am being tempted right now. Please pray for me, and message me back.";

function Tell() {
  const { user, enabled } = useAuth();
  const { bundle } = usePartner();
  const partnerId = bundle?.partnership?.partnerId ?? null;
  const partnerName = bundle?.partner?.name || "your friend";
  const [text, setText] = useState(DEFAULT_SOS);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const send = async () => {
    if (!partnerId) return;
    setState("sending");
    try {
      await sendNote(partnerId, "sos", text.trim() || DEFAULT_SOS);
      setState("sent");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not send");
      setState("error");
    }
  };

  const share = async () => {
    const body = text.trim() || DEFAULT_SOS;
    try {
      if (navigator.share) {
        await navigator.share({ text: body });
        return;
      }
      await navigator.clipboard.writeText(body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div>
      <label htmlFor="sos" className="block text-sm font-semibold text-linen">
        Your message
      </label>
      <textarea
        id="sos"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="field mt-2 !bg-white/10 !text-linen"
      />
      <div className="mt-3 flex flex-wrap gap-3">
        {enabled && user && partnerId ? (
          <button className="btn btn-gold" disabled={state === "sending" || state === "sent"} onClick={send}>
            {state === "sent" ? `Sent to ${partnerName}` : state === "sending" ? "Sending\u2026" : `Send to ${partnerName}`}
          </button>
        ) : null}
        <button className="btn btn-ghost-light" onClick={share}>
          {copied ? "Copied. Paste it to someone you trust." : "Send it another way"}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-clay-pale" role="alert">
          {err}. Use &ldquo;Send it another way&rdquo; instead.
        </p>
      )}
      {!partnerId && (
        <p className="mt-3 text-sm text-linen/70">
          Pair up in{" "}
          <Link href="/partner" className="text-dawn underline underline-offset-4">
            Together
          </Link>{" "}
          and this button will send your friend an urgent note.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The page                                                            */
/* ------------------------------------------------------------------ */

function Step({
  n,
  title,
  done,
  onDone,
  children,
}: {
  n: number;
  title: string;
  done: boolean;
  onDone: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="night-panel px-5 py-6 sm:px-7">
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dawn font-bold text-night-deep">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-3xl text-dawn-pale">{title}</h2>
          <div className="mt-3">{children}</div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-linen/80">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#e8b86d]"
              checked={done}
              onChange={(e) => onDone(e.target.checked)}
            />
            Done with this
          </label>
        </div>
      </div>
    </section>
  );
}

export function FleeView({ verses, verseRefs }: { verses: Record<string, VerseData>; verseRefs: string[] }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [vi, setVi] = useState(0);
  const set = useCallback((n: number) => (v: boolean) => setDone((d) => ({ ...d, [n]: v })), []);
  const available = verseRefs.filter((r) => verses[r]);
  const ref = available[vi % Math.max(1, available.length)];

  return (
    <div className="bg-night-deep text-linen">
      <div className="mx-auto max-w-2xl px-5 pb-24 pt-14">
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <p className="eyebrow !text-dawn">Right now</p>
          <h1 className="mt-2 text-5xl text-dawn-pale sm:text-6xl">Flee</h1>
          <p className="mt-4 text-lg text-linen/85">
            You are not in trouble. You reached for the right thing. Do these in order, one at a time. You do not have
            to feel ready, you only have to take the next step.
          </p>
        </motion.div>

        <div className="mt-10 space-y-5">
          <Step n={1} title="Stand up and leave" done={!!done[1]} onDone={set(1)}>
            <p className="text-linen/85">
              Joseph did not argue. He ran. Stand up now. Put the phone down, or turn the screen face-down and walk
              away from it. Leave the room. Go to where other people are, or go outside. Turn on a light.
            </p>
          </Step>

          <Step n={2} title="Breathe" done={!!done[2]} onDone={set(2)}>
            <p className="mb-4 text-linen/85">
              Slow breathing tells your body it is not under attack. In for 4, hold for 7, out for 8.
            </p>
            <Breathing />
          </Step>

          <Step n={3} title="Say the truth" done={!!done[3]} onDone={set(3)}>
            {ref ? (
              <>
                <Verse data={verses[ref]} dark />
                <button
                  className="btn btn-ghost-light mt-3 !min-h-0 !py-2"
                  onClick={() => setVi((i) => i + 1)}
                >
                  Another verse
                </button>
              </>
            ) : (
              <p className="text-linen/85">
                Say it aloud: <em>The LORD is my helper. I will not fear. Jesus, help me now.</em>
              </p>
            )}
            <p className="mt-3 text-sm text-linen/70">Read it aloud, slowly. Then pray, in your own words: <em>Lord, help me.</em></p>
          </Step>

          <Step n={4} title="Ride the wave" done={!!done[4]} onDone={set(4)}>
            <Surf />
          </Step>

          <Step n={5} title="Tell someone" done={!!done[5]} onDone={set(5)}>
            <p className="mb-4 text-linen/85">Secrets are where it grows. One short message breaks the spell.</p>
            <Tell />
          </Step>

          <Step n={6} title="Move your body" done={!!done[6]} onDone={set(6)}>
            <p className="text-linen/85">
              Twenty push-ups, a fast walk around the block, or a cold shower. Do something hard with your body for five
              minutes. Then drink a glass of water and eat something if you are hungry.
            </p>
          </Step>
        </div>

        <div className="mt-10 rounded-2xl bg-white/5 px-6 py-6">
          <p className="font-display text-3xl text-dawn-pale">If you already fell</p>
          <p className="mt-2 text-linen/85">
            Romans 8:1. There is no condemnation, and you are not finished. Wash your face, tell God, tell your friend,
            and eat or sleep. Do not decide anything about your worth at this hour.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/journey/wilderness/when-you-fall" className="btn btn-gold">
              Read: when you fall <IconArrow width={18} height={18} />
            </Link>
            <Link href="/checkin" className="btn btn-ghost-light">
              Check in honestly
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-clay/50 bg-clay/10 px-6 py-5">
          <p className="font-semibold text-linen">If you are in danger, or thinking of hurting yourself</p>
          <p className="mt-1 text-sm text-linen/85">
            This matters more than anything on this page. Please contact local emergency services, or someone near you,
            now. The{" "}
            <Link href="/help" className="text-dawn underline underline-offset-4">
              Help page
            </Link>{" "}
            lists places to reach a real person.
          </p>
        </div>
      </div>
    </div>
  );
}
