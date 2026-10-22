"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Stage } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { stageProgress, type Step } from "@/lib/journey";
import { useStore } from "@/lib/store";
import { Verse } from "./Verse";
import { IconArrow, IconStone } from "./Icons";

/** A river stone, drawn so each one is slightly different. */
function Stone({ lit, seed, color }: { lit: boolean; seed: number; color: string }) {
  const r = (n: number) => Math.round(n * 10) / 10;
  const wob = (k: number) => r(((seed * 37 + k * 17) % 9) - 4);
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-32" aria-hidden>
      <defs>
        <radialGradient id={`stone-${seed}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={lit ? "#fbeccb" : "#3a3f66"} />
          <stop offset="100%" stopColor={lit ? color : "#232852"} />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="80" rx="46" ry="6" fill="rgba(27,31,59,0.18)" />
      <path
        d={`M${r(14 + wob(1))} 54 C${r(10 + wob(2))} 26 ${r(38 + wob(3))} 10 ${r(62 + wob(4))} 12 C${r(92 + wob(5))} 14 ${r(112 + wob(6))} 34 ${r(106 + wob(7))} 58 C${r(102 + wob(8))} 78 ${r(76 + wob(9))} 80 ${r(56 + wob(1))} 80 C${r(32 + wob(2))} 80 ${r(18 + wob(3))} 72 ${r(14 + wob(1))} 54 Z`}
        fill={`url(#stone-${seed})`}
        stroke={lit ? "#c8903f" : "rgba(247,241,230,0.18)"}
        strokeWidth="2"
      />
      {lit && <path d="M34 34 C42 24 54 22 64 24" stroke="rgba(255,255,255,0.6)" strokeWidth="3" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

export function StonesView({
  stages,
  steps,
  verses,
}: {
  stages: Stage[];
  steps: Step[];
  verses: Record<string, VerseData>;
}) {
  const { state, act } = useStore();
  const reduce = useReducedMotion();
  const prog = stages.map((s) => ({ stage: s, ...stageProgress(state, steps, s.id) }));
  const laid = prog.filter((p) => p.complete);

  // Mark stones as seen once viewed, so the celebration only appears once.
  useEffect(() => {
    if (!state.hydrated) return;
    laid.forEach((p) => act({ type: "stoneSeen", id: p.stage.id }));
  }, [state.hydrated, laid.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Joshua 4</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Stones of Remembrance</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        When Israel crossed the Jordan, God had them lift twelve stones from the riverbed to stand as a memorial. When
        your children ask, <em>what do these stones mean?</em> you will say: God brought us through. Each stage you
        finish lays one here.
      </p>

      <div className="mt-8 max-w-xl">
        <Verse data={verses["Joshua 4:6-7"]} size="sm" />
      </div>

      <p className="mt-8 text-night/70">
        {state.hydrated ? laid.length : 0} of {stages.length} stones laid.
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2">
        {prog.map((p, i) => (
          <motion.li
            key={p.stage.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: (i % 2) * 0.08 }}
            className={p.complete ? "paper px-6 py-6" : "rounded-2xl border border-dashed border-night/20 bg-night/[0.04] px-6 py-6"}
          >
            <div className="flex items-center gap-4">
              <Stone lit={p.complete} seed={i + 1} color={p.stage.accent} />
              <div className="min-w-0">
                <p className="eyebrow">Stage {p.stage.number}</p>
                <p className="font-display text-3xl leading-tight">{p.stage.name}</p>
                <p className="text-sm text-night/70">{p.stage.place}</p>
              </div>
            </div>
            <p className={`mt-4 ${p.complete ? "text-night/85" : "text-night/70"}`}>
              {p.complete ? p.stage.story : "Not yet laid. Finish every step of this stage to set the stone."}
            </p>
            <p className="mt-2 text-sm text-night/70">
              {p.stage.storyRef} &middot; {state.hydrated ? p.done : 0} of {p.total} steps sealed
            </p>
            {!p.complete && (
              <Link href={`/journey/${p.stage.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-night underline decoration-dawn decoration-2 underline-offset-4">
                Go to the stage <IconArrow width={15} height={15} />
              </Link>
            )}
            {p.complete && (
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-olive-deep">
                <IconStone width={18} height={18} /> Laid
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
