"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { VerseData } from "@/lib/verses";
import { daysInTheLight, honestStreak, shiftDay, todayKey, uid, useStore, type Walk } from "@/lib/store";
import { Verse } from "./Verse";
import { Reveal } from "./Section";
import { IconArrow, IconLamp } from "./Icons";

const areas: { key: "mind" | "purity" | "substances"; title: string; hint: string }[] = [
  { key: "mind", title: "My mind", hint: "What I looked at, replayed, and let in" },
  { key: "purity", title: "My body and sexual purity", hint: "Pornography, masturbation, and anything with another person" },
  { key: "substances", title: "Alcohol, weed and drugs", hint: "Anything I used to escape or numb out" },
];

const choices: { value: Walk; label: string; style: string }[] = [
  { value: "walked", label: "Walked in the light", style: "border-olive bg-olive text-white" },
  { value: "wavered", label: "Wavered", style: "border-dawn-deep bg-dawn text-night-deep" },
  { value: "fell", label: "Fell", style: "border-clay-deep bg-clay text-white" },
  { value: "na", label: "Not a struggle", style: "border-night/40 bg-night/10 text-night" },
];

const dotColor: Record<Walk | "none", string> = {
  walked: "bg-olive",
  wavered: "bg-dawn",
  fell: "bg-clay",
  na: "bg-night/20",
  none: "bg-night/8",
};

const worstOf = (...w: Walk[]): Walk => {
  const order: Walk[] = ["na", "walked", "wavered", "fell"];
  return w.reduce((a, b) => (order.indexOf(b) > order.indexOf(a) ? b : a), "na" as Walk);
};

export function CheckinView({ verses }: { verses: Record<string, VerseData> }) {
  const { state, act } = useStore();
  const reduce = useReducedMotion();
  const today = todayKey();
  const [day, setDay] = useState(today);
  const existing = state.checkins[day];
  const [vals, setVals] = useState<Record<string, Walk | undefined>>({});
  const [note, setNote] = useState("");
  const [shareNote, setShareNote] = useState(false);
  const [saved, setSaved] = useState<null | "fell" | "wavered" | "walked">(null);

  useEffect(() => {
    setVals(existing ? { mind: existing.mind, purity: existing.purity, substances: existing.substances } : {});
    setNote(existing?.note ?? "");
    setShareNote(existing?.noteShared ?? false);
    setSaved(null);
  }, [day, existing, state.hydrated]);

  const complete = areas.every((a) => vals[a.key]);
  const streak = honestStreak(state.checkins);
  const light = daysInTheLight(state.checkins);
  const total = Object.keys(state.checkins).length;

  const save = () => {
    const mind = vals.mind as Walk;
    const purity = vals.purity as Walk;
    const substances = vals.substances as Walk;
    act({
      type: "checkin",
      checkin: {
        id: existing?.id ?? uid(),
        date: day,
        mind,
        purity,
        substances,
        note: note.trim() || undefined,
        noteShared: shareNote,
        updatedAt: new Date().toISOString(),
      },
    });
    const w = worstOf(mind, purity, substances);
    setSaved(w === "fell" ? "fell" : w === "wavered" ? "wavered" : "walked");
  };

  const calendar = Array.from({ length: 28 }).map((_, i) => shiftDay(today, -(27 - i)));

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Honest days in a row", value: state.hydrated ? streak : 0, sub: "Honesty keeps this alive, even after a fall." },
          {
            label: light?.sinceFall ? "Days since the last fall" : "Days walking with the lamp",
            value: state.hydrated && light ? light.days : 0,
            sub: "Not a score to protect. A road to keep walking.",
          },
          { label: "Check-ins so far", value: state.hydrated ? total : 0, sub: "Every one is a small act of courage." },
        ].map((s) => (
          <div key={s.label} className="paper px-5 py-5">
            <p className="font-display text-5xl text-night">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-night">{s.label}</p>
            <p className="mt-1 text-xs text-night/70">{s.sub}</p>
          </div>
        ))}
      </div>

      <Reveal className="paper px-6 py-8 sm:px-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">The lamp check-in</p>
            <h2 className="mt-1 text-3xl sm:text-4xl">{day === today ? "How was today, honestly?" : "How was yesterday, honestly?"}</h2>
          </div>
          <div className="flex rounded-full bg-night/5 p-1 text-sm font-semibold" role="tablist" aria-label="Day">
            {[
              { k: today, l: "Today" },
              { k: shiftDay(today, -1), l: "Yesterday" },
            ].map((d) => (
              <button
                key={d.k}
                role="tab"
                aria-selected={day === d.k}
                onClick={() => setDay(d.k)}
                className={`rounded-full px-4 py-1.5 transition-colors duration-500 ${day === d.k ? "bg-night text-dawn-pale" : "text-night/70"}`}
              >
                {d.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {areas.map((a) => (
            <fieldset key={a.key}>
              <legend className="font-display text-2xl text-night">{a.title}</legend>
              <p className="text-sm text-night/70">{a.hint}</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {choices.map((c) => {
                  const on = vals[a.key] === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setVals((v) => ({ ...v, [a.key]: c.value }))}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-500 ${
                        on ? c.style : "border-night/15 bg-white/60 text-night/70 hover:border-night/40"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <label htmlFor="checkin-note" className="mt-7 block text-sm font-semibold">
          Anything you want to say? <span className="font-normal text-night/70">(optional)</span>
        </label>
        <textarea
          id="checkin-note"
          className="field mt-2 min-h-24"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What helped, what was hard, what you are thankful for."
        />
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-night/75">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#c8903f]"
            checked={shareNote}
            onChange={(e) => setShareNote(e.target.checked)}
          />
          Let my friend read this note (your answers above are always shared with them)
        </label>

        <button className="btn btn-gold mt-6" disabled={!complete} onClick={save}>
          <IconLamp width={18} height={18} /> {existing ? "Update my check-in" : "Light the lamp"}
        </button>
        {!complete && <p className="mt-2 text-sm text-night/70">Answer all three, then you can save.</p>}
      </Reveal>

      {saved && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="night-panel stars px-6 py-8 sm:px-9"
          role="status"
        >
          {saved === "fell" ? (
            <>
              <p className="eyebrow !text-dawn">Get up</p>
              <h3 className="mt-1 text-4xl">You were honest. That is not nothing.</h3>
              <p className="mt-3 text-linen/85">
                You are not the person who fell. You are the person who stood up and said so. The righteous fall and
                rise again, and that rising is part of the story God is writing.
              </p>
              <div className="mt-5 space-y-3">
                <Verse data={verses["Lamentations 3:22-23"]} size="sm" dark showTabs={false} />
                <Verse data={verses["Proverbs 24:16"]} size="sm" dark showTabs={false} />
              </div>
              <ol className="mt-6 list-decimal space-y-2 pl-5 text-linen/90 marker:font-bold marker:text-dawn">
                <li>
                  <strong>Tell God now.</strong> One sentence. 1 John 1:9 is a promise, not a threat.
                </li>
                <li>
                  <strong>Find the first step of the slide.</strong> Not the fall: the first small decision before it.
                </li>
                <li>
                  <strong>Tell your friend.</strong> Shame hates being spoken.{" "}
                  <Link href="/partner" className="text-dawn underline underline-offset-4">
                    Together
                  </Link>
                </li>
                <li>
                  <strong>Do the next right thing:</strong> water, a walk, sleep, a verse.
                </li>
              </ol>
              <Link href="/flee" className="btn btn-gold mt-6">
                Open the Flee page <IconArrow width={18} height={18} />
              </Link>
            </>
          ) : saved === "wavered" ? (
            <>
              <p className="eyebrow !text-dawn">You noticed</p>
              <h3 className="mt-1 text-4xl">Noticing is the whole skill.</h3>
              <p className="mt-3 text-linen/85">
                Wavering means you were awake enough to feel the pull. Ask: what was the cue? Hungry, angry, lonely,
                tired? Plan one thing for tomorrow&rsquo;s version of that moment.
              </p>
            </>
          ) : (
            <>
              <p className="eyebrow !text-dawn">Walked in the light</p>
              <h3 className="mt-1 text-4xl">Thank God, and guard the gate.</h3>
              <p className="mt-3 text-linen/85">
                Victory is a gift to receive and a gate to guard. Tell your friend what helped today. It may be
                exactly what they need.
              </p>
            </>
          )}
        </motion.div>
      )}

      <Reveal className="paper px-6 py-7">
        <p className="eyebrow">The last four weeks</p>
        <div className="mt-4 grid grid-cols-7 gap-2 sm:max-w-md" role="group" aria-label="Last twenty-eight days of check-ins">
          {calendar.map((d) => {
            const c = state.checkins[d];
            const w = c ? worstOf(c.mind, c.purity, c.substances) : "none";
            return (
              <button
                key={d}
                onClick={() => setDay(d === today || d === shiftDay(today, -1) ? d : day)}
                title={`${d}: ${c ? w : "no check-in"}`}
                className={`aspect-square rounded-full ${dotColor[w]} ${d === today ? "ring-2 ring-night/40 ring-offset-2 ring-offset-parchment" : ""}`}
                aria-label={`${d}: ${c ? w : "no check-in"}`}
              />
            );
          })}
        </div>
        <p className="mt-4 text-xs text-night/70">
          Green walked. Gold wavered. Clay fell, and was honest about it. Empty means no check-in, and that is okay: come back
          tonight.
        </p>
      </Reveal>
    </div>
  );
}
