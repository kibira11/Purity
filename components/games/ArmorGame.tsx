"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { armor, type ArmorPiece } from "@/content/armor";
import type { VerseData } from "@/lib/verses";
import { Verse } from "../Verse";
import { Rich } from "../Rich";
import { seededShuffle } from "@/lib/shuffle";

/** A simple figure that gains a piece of armor each time you answer well. */
function Figure({ on }: { on: Set<string> }) {
  const gold = "#e8b86d";
  const idle = "rgba(247,241,230,0.22)";
  const fill = (id: string) => (on.has(id) ? gold : "transparent");
  const stroke = (id: string) => (on.has(id) ? "#f4d596" : idle);
  const t = "fill 1.2s ease, stroke 1.2s ease, opacity 1.2s ease";
  return (
    <svg viewBox="0 0 180 320" className="mx-auto h-72 w-auto" role="img" aria-label={`${on.size} of ${armor.length} pieces put on`}>
      {/* prayer: light around the whole figure */}
      <ellipse
        cx="90"
        cy="160"
        rx="82"
        ry="150"
        fill="none"
        stroke={on.has("prayer") ? gold : idle}
        strokeWidth="2"
        strokeDasharray="4 8"
        style={{ transition: t, opacity: on.has("prayer") ? 0.9 : 0.5 }}
      />
      {/* head */}
      <circle cx="90" cy="58" r="22" fill="rgba(247,241,230,0.08)" stroke={idle} strokeWidth="2" />
      {/* helmet */}
      <path
        d="M66 56 C66 30 78 22 90 22 C102 22 114 30 114 56 L106 56 L106 48 L74 48 L74 56 Z"
        fill={fill("helmet")}
        stroke={stroke("helmet")}
        strokeWidth="2.5"
        style={{ transition: t }}
      />
      {/* torso */}
      <rect x="62" y="84" width="56" height="96" rx="8" fill="rgba(247,241,230,0.06)" stroke={idle} strokeWidth="2" />
      {/* breastplate */}
      <path
        d="M66 88 L114 88 L110 150 C100 162 80 162 70 150 Z"
        fill={fill("breastplate")}
        stroke={stroke("breastplate")}
        strokeWidth="2.5"
        style={{ transition: t }}
      />
      {/* belt */}
      <rect x="60" y="160" width="60" height="14" rx="3" fill={fill("belt")} stroke={stroke("belt")} strokeWidth="2.5" style={{ transition: t }} />
      {/* legs */}
      <rect x="66" y="178" width="20" height="92" rx="6" fill="rgba(247,241,230,0.06)" stroke={idle} strokeWidth="2" />
      <rect x="94" y="178" width="20" height="92" rx="6" fill="rgba(247,241,230,0.06)" stroke={idle} strokeWidth="2" />
      {/* shoes */}
      <path d="M60 270 L86 270 L86 288 L52 288 C52 278 56 272 60 270 Z" fill={fill("shoes")} stroke={stroke("shoes")} strokeWidth="2.5" style={{ transition: t }} />
      <path d="M94 270 L120 270 C124 272 128 278 128 288 L94 288 Z" fill={fill("shoes")} stroke={stroke("shoes")} strokeWidth="2.5" style={{ transition: t }} />
      {/* shield (left arm) */}
      <path
        d="M16 96 L56 96 L56 140 C56 160 36 172 36 172 C36 172 16 160 16 140 Z"
        fill={fill("shield")}
        stroke={stroke("shield")}
        strokeWidth="2.5"
        style={{ transition: t }}
      />
      {/* sword (right arm) */}
      <g style={{ transition: t, opacity: on.has("sword") ? 1 : 0.55 }}>
        <line x1="146" y1="64" x2="146" y2="170" stroke={stroke("sword")} strokeWidth="5" strokeLinecap="round" />
        <line x1="134" y1="170" x2="158" y2="170" stroke={stroke("sword")} strokeWidth="5" strokeLinecap="round" />
        <line x1="146" y1="170" x2="146" y2="188" stroke={stroke("sword")} strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function ArmorGame({
  verses,
  onWin,
  alreadyWon = false,
}: {
  verses: Record<string, VerseData>;
  onWin: () => void;
  alreadyWon?: boolean;
}) {
  const reduce = useReducedMotion();
  const order = useMemo<ArmorPiece[]>(() => seededShuffle(armor, "armor-of-god"), []);
  const [round, setRound] = useState(0);
  const [on, setOn] = useState<Set<string>>(() => new Set(alreadyWon ? armor.map((a) => a.id) : []));
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(alreadyWon);
  const fired = useRef(false);

  const current = order[round];
  const correct = picked === current?.id;

  useEffect(() => {
    if (done && !fired.current && !alreadyWon) {
      fired.current = true;
      onWin();
    }
  }, [done, onWin, alreadyWon]);

  const choose = (id: string) => {
    if (!current || correct) return;
    if (id === current.id) {
      setPicked(id);
      setWrong(null);
      setOn((s) => new Set(s).add(id));
    } else {
      setWrong(id);
    }
  };

  const next = () => {
    if (round + 1 >= order.length) {
      setDone(true);
      return;
    }
    setRound((r) => r + 1);
    setPicked(null);
    setWrong(null);
  };

  const restart = () => {
    setOn(new Set());
    setRound(0);
    setPicked(null);
    setWrong(null);
    setDone(false);
  };

  const wrongPiece = wrong ? armor.find((a) => a.id === wrong) : null;

  if (done) {
    return (
      <div className="grid items-center gap-6 sm:grid-cols-[200px_1fr]">
        <Figure on={on} />
        <div>
          <p className="font-display text-3xl text-dawn-pale">Fully armed</p>
          <p className="mt-2 text-linen/85">
            You know what each piece is for. The battle is real, and so is the Captain of the host. Put it on each
            morning, one piece at a time.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-linen/80">
            {armor.map((a) => (
              <li key={a.id}>
                <strong className="text-dawn-pale">{a.name}.</strong> {a.practice}
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost-light mt-5 !min-h-0 !py-2" onClick={restart}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-linen/75">
        Paul wrote Ephesians 6 from a Roman prison, chained to a soldier. Seven moments, seven answers. Choose the
        piece you would reach for.
      </p>
      <div className="mt-4 grid items-start gap-6 sm:grid-cols-[200px_1fr]">
        <div>
          <Figure on={on} />
          <p className="mt-2 text-center text-xs text-linen/60">
            {on.size} of {armor.length} on
          </p>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
            >
              <p className="eyebrow !text-dawn">
                Moment {round + 1} of {order.length}
              </p>
              <p className="mt-2 font-scripture text-[1.1rem] leading-[1.75] text-linen">
                <Rich text={current.situation} />
              </p>

              {!correct && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {armor.map((a) => {
                    const used = on.has(a.id);
                    return (
                      <button
                        key={a.id}
                        disabled={used}
                        onClick={() => choose(a.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-colors duration-500 ${
                          used
                            ? "border-dawn/30 bg-dawn/10 text-dawn-pale/70"
                            : wrong === a.id
                              ? "border-clay bg-clay/20 text-linen"
                              : "border-linen/25 bg-white/10 text-linen hover:border-dawn/70 hover:bg-white/15"
                        }`}
                      >
                        {used ? "\u2713 " : ""}
                        {a.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {wrongPiece && !correct && (
                <p className="mt-3 rounded-xl bg-clay/20 px-4 py-3 text-sm text-linen/90" role="status">
                  <strong>{wrongPiece.name}</strong> is for another moment: {wrongPiece.meaning} Think about what this
                  moment is really attacking, and try again.
                </p>
              )}

              {correct && (
                <div className="mt-4 rounded-2xl bg-olive/25 p-5" role="status">
                  <p className="font-display text-3xl text-dawn-pale">{current.name}</p>
                  <p className="mt-2 text-[1rem] text-linen/90">
                    <Rich text={current.why} />
                  </p>
                  {verses[current.ref] && (
                    <div className="mt-4">
                      <Verse data={verses[current.ref]} size="sm" dark showTabs={false} />
                    </div>
                  )}
                  <p className="mt-3 text-sm text-linen/75">
                    <strong className="text-dawn-pale">Put it on today:</strong> {current.practice}
                  </p>
                  <button className="btn btn-gold mt-4 !min-h-0 !py-2" onClick={next}>
                    {round + 1 >= order.length ? "Finish" : "Next moment"}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
