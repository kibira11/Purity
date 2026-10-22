"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { seededShuffle } from "@/lib/shuffle";
import { useTranslation } from "@/lib/useTranslation";
import type { VerseData } from "@/lib/verses";

function chunkWords(text: string) {
  const words = text.split(" ").filter(Boolean);
  const n = words.length;
  const size = n <= 12 ? 1 : n <= 24 ? 2 : n <= 36 ? 3 : 4;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += size) chunks.push(words.slice(i, i + size).join(" "));
  return chunks;
}

export function VerseBuilder({
  verse,
  onWin,
  alreadyWon = false,
}: {
  verse: VerseData;
  onWin: () => void;
  alreadyWon?: boolean;
}) {
  const [pick] = useTranslation();
  const reduce = useReducedMotion();
  const text = (pick === "KJV" ? verse.kjv : verse.web) ?? verse.web ?? verse.kjv ?? "";
  const chunks = useMemo(() => chunkWords(text), [text]);
  const [round, setRound] = useState(0);
  const order = useMemo(
    () => seededShuffle(chunks.map((_, i) => i), `${verse.ref}-${text.length}-${round}`),
    [chunks, verse.ref, text.length, round],
  );
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState(false);
  const won = placed.length === chunks.length && chunks.length > 0;
  const fired = useRef(false);

  useEffect(() => {
    setPlaced([]);
    setWrong(null);
    setStreak(0);
    setHint(false);
    fired.current = false;
  }, [text, round]);

  useEffect(() => {
    if (won && !fired.current) {
      fired.current = true;
      onWin();
    }
  }, [won, onWin]);

  if (!text) {
    return <p className="text-night/70">This passage is being prepared. Check back soon.</p>;
  }

  const tap = (idx: number) => {
    if (won || placed.includes(idx)) return;
    if (idx === placed.length) {
      setPlaced((p) => [...p, idx]);
      setStreak(0);
      setHint(false);
    } else {
      setWrong(idx);
      setStreak((s) => s + 1);
      window.setTimeout(() => setWrong(null), 600);
    }
  };

  const showHint = hint || streak >= 3;

  return (
    <div>
      <p className="text-sm text-linen/75">
        Tap the pieces in order to rebuild the verse. Say each piece aloud as you place it, because that is how it
        sinks in.
      </p>

      <div
        className="mt-5 min-h-[7.5rem] rounded-2xl border border-dawn/30 bg-night-deep/60 p-5 font-scripture text-[1.15rem] leading-[1.9] text-linen"
        aria-live="polite"
      >
        {chunks.map((c, i) => {
          const isPlaced = i < placed.length;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: isPlaced ? 1 : 0.18, color: won ? "#f6dfb2" : "#f7f1e6" }}
              transition={{ duration: reduce ? 0 : 0.7 }}
              className="mr-1.5 inline-block"
            >
              {isPlaced ? c : "\u2014".repeat(Math.min(Math.max(c.length / 3, 2), 6))}
            </motion.span>
          );
        })}
        <div className="mt-2 text-sm text-dawn">{verse.ref}</div>
      </div>

      {!won && (
        <>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {order.map((idx) => {
              const used = placed.includes(idx);
              const isHint = showHint && idx === placed.length;
              return (
                <motion.button
                  layout={!reduce}
                  key={idx}
                  disabled={used}
                  onClick={() => tap(idx)}
                  animate={
                    wrong === idx && !reduce
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : { x: 0, opacity: used ? 0.15 : 1, scale: isHint ? [1, 1.06, 1] : 1 }
                  }
                  transition={{ duration: 0.6, repeat: isHint && wrong !== idx ? Infinity : 0 }}
                  className={`rounded-xl border px-3.5 py-2 text-left font-scripture text-[1.02rem] transition-colors duration-500 ${
                    used
                      ? "border-transparent bg-white/5 text-linen/30"
                      : isHint
                        ? "border-dawn bg-dawn/25 text-linen"
                        : wrong === idx
                          ? "border-clay bg-clay/25 text-linen"
                          : "border-linen/25 bg-white/10 text-linen hover:border-dawn/70 hover:bg-white/15"
                  }`}
                >
                  {chunks[idx]}
                </motion.button>
              );
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <button className="btn btn-ghost-light !min-h-0 !py-1.5" onClick={() => setHint(true)}>
              Show me the next piece
            </button>
            <button
              className="btn btn-ghost-light !min-h-0 !py-1.5"
              onClick={() => setRound((r) => r + 1)}
            >
              Shuffle again
            </button>
            <span className="text-linen/60">
              {placed.length} of {chunks.length}
            </span>
          </div>
        </>
      )}

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 1 }}
          className="mt-5 rounded-2xl bg-dawn/15 p-5 text-dawn-pale"
        >
          <p className="font-display text-2xl">Hidden in your heart.</p>
          <p className="mt-1 text-sm text-linen/80">
            {alreadyWon
              ? "You have built this one before. Try saying it from memory."
              : "Now say it once from memory, out loud."}{" "}
            &ldquo;Thy word have I hid in mine heart, that I might not sin against thee.&rdquo; Psalm 119:11
          </p>
          <button className="btn btn-ghost-light mt-4 !min-h-0 !py-1.5" onClick={() => setRound((r) => r + 1)}>
            Build it again
          </button>
        </motion.div>
      )}
    </div>
  );
}
