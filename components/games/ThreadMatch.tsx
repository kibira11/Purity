"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { seededShuffle } from "@/lib/shuffle";
import { useTranslation } from "@/lib/useTranslation";
import type { VerseData } from "@/lib/verses";
import { pickText } from "./../Verse";

export interface ThreadPair {
  ref: string;
  note: string;
  verse: VerseData;
}

function snippet(v: VerseData, pick: Parameters<typeof pickText>[1]) {
  const t = pickText(v, pick === "MODERN" ? "WEB" : pick)?.text ?? "";
  const words = t.split(" ");
  return words.length > 16 ? words.slice(0, 16).join(" ") + "\u2026" : t;
}

function NoteList({
  notes,
  matched,
  wrong,
  selected,
  reduce,
  onChoose,
  className = "",
  id,
}: {
  notes: ThreadPair[];
  matched: string[];
  wrong: string | null;
  selected: string | null;
  reduce: boolean | null;
  onChoose: (ref: string) => void;
  className?: string;
  id?: string;
}) {
  return (
    <ul id={id} className={`space-y-2.5 ${className}`} aria-label="Explanations">
      {notes.map((p) => {
        const done = matched.includes(p.ref);
        const isWrong = wrong === p.ref;
        const active = !!selected && !done;
        return (
          <li key={p.ref}>
            <motion.button
              type="button"
              disabled={done || !selected}
              onClick={() => onChoose(p.ref)}
              animate={isWrong && !reduce ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.55 }}
              className={`w-full rounded-xl border px-4 py-3 text-left text-[0.97rem] leading-snug transition-colors duration-500 ${
                done
                  ? "border-olive/60 bg-olive/20 text-linen/80"
                  : isWrong
                    ? "border-clay bg-clay/25 text-linen"
                    : active
                      ? "border-linen/35 bg-white/10 text-linen hover:border-dawn/70"
                      : "border-linen/15 bg-white/5 text-linen/55"
              }`}
            >
              {p.note}
              {done && <span className="ml-2 text-xs font-bold text-dawn-pale">{p.ref}</span>}
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
}

export function ThreadMatch({
  pairs,
  keyRef,
  onWin,
}: {
  pairs: ThreadPair[];
  keyRef: string;
  onWin: () => void;
}) {
  const reduce = useReducedMotion();
  const [pick] = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const notes = useMemo(() => seededShuffle(pairs, `thread-${keyRef}`), [pairs, keyRef]);
  const won = matched.length === pairs.length && pairs.length > 0;
  const fired = useRef(false);
  const mobileMatchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (won && !fired.current) {
      fired.current = true;
      onWin();
    }
  }, [won, onWin]);

  useEffect(() => {
    if (!selected || won) return;
    const narrow = window.matchMedia("(max-width: 1023px)");
    if (!narrow.matches) return;
    const t = window.setTimeout(() => {
      mobileMatchRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [selected, won, reduce]);

  const chooseNote = (ref: string) => {
    if (!selected || matched.includes(ref)) return;
    setTries((t) => t + 1);
    if (selected === ref) {
      setMatched((m) => [...m, ref]);
      setSelected(null);
    } else {
      setWrong(ref);
      window.setTimeout(() => setWrong(null), 650);
    }
  };

  const noteListProps = {
    notes,
    matched,
    wrong,
    selected,
    reduce,
    onChoose: chooseNote,
  };

  return (
    <div>
      <p className="text-sm text-linen/75">
        Scripture explains Scripture. Tap a passage, then tap the sentence that tells how it helps us understand{" "}
        <strong className="text-dawn-pale">{keyRef}</strong>.
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <ul className="space-y-2.5" aria-label="Passages">
            {pairs.map((p) => {
              const done = matched.includes(p.ref);
              const on = selected === p.ref;
              return (
                <li key={p.ref}>
                  <button
                    type="button"
                    disabled={done}
                    onClick={() => setSelected(on ? null : p.ref)}
                    aria-pressed={on}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-colors duration-500 ${
                      done
                        ? "border-olive/60 bg-olive/20 text-linen/80"
                        : on
                          ? "border-dawn bg-dawn/20 text-linen"
                          : "border-linen/25 bg-white/10 text-linen hover:border-dawn/60"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-dawn-pale">{p.ref}</span>
                    <span className="mt-0.5 block font-scripture text-[0.98rem] leading-snug">
                      {snippet(p.verse, pick)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {!won && (
            <div ref={mobileMatchRef} className="mt-4 lg:hidden">
              {selected ? (
                <>
                  <p className="text-sm font-semibold text-dawn-pale">
                    Step 2: tap the sentence that matches{" "}
                    <span className="text-linen">{selected}</span>
                  </p>
                  <NoteList {...noteListProps} className="mt-2.5" />
                </>
              ) : (
                <p className="rounded-xl border border-linen/15 bg-white/5 px-4 py-3 text-sm text-linen/65">
                  Tap a passage above. The matching sentences will appear here.
                </p>
              )}
            </div>
          )}
        </div>

        <NoteList {...noteListProps} className="hidden lg:block" />
      </div>

      <p className="mt-4 text-sm text-linen/60">
        {matched.length} of {pairs.length} threads connected{tries > matched.length ? ` \u00b7 ${tries - matched.length} gentle misses` : ""}
      </p>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 1 }}
          className="mt-4 rounded-2xl bg-dawn/15 p-5 text-dawn-pale"
        >
          <p className="font-display text-2xl">The thread holds.</p>
          <p className="mt-1 text-sm text-linen/80">
            Notice how every passage leans on the others. That is how the whole Bible is woven together.
          </p>
        </motion.div>
      )}
    </div>
  );
}