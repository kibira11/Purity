"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Stage } from "@/lib/types";
import { useStore, honestStreak } from "@/lib/store";
import { isSealed, isUnlocked, nextStep, overall, stageProgress, stepHref, type Step } from "@/lib/journey";
import { StageScene } from "./StageScene";
import { IconArrow, IconCheck, IconLock, IconStone } from "./Icons";

function PathSegment({ fromLeft, done }: { fromLeft: boolean; done: boolean }) {
  const d = fromLeft ? "M 25 0 C 25 70, 75 30, 75 100" : "M 75 0 C 75 70, 25 30, 25 100";
  return (
    <>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="hidden h-28 w-full lg:block"
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          stroke={done ? "#e8b86d" : "rgba(247,241,230,0.45)"}
          strokeWidth={done ? 4 : 3}
          strokeDasharray={done ? undefined : "1 7"}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={done ? { filter: "drop-shadow(0 0 6px rgba(232,184,109,0.8))" } : undefined}
        />
      </svg>
      <div className="mx-auto my-1 h-14 w-px border-l-2 border-dashed border-dawn/60 lg:hidden" aria-hidden />
    </>
  );
}

function skyGradient(stages: Stage[]) {
  const stops = stages.map((s, i) => `${s.sky[0]} ${Math.round((i / stages.length) * 100)}%`);
  stops.push(`${stages[stages.length - 1].sky[1]} 100%`);
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

export function JourneyMap({ stages, steps }: { stages: Stage[]; steps: Step[] }) {
  const { state } = useStore();
  const reduce = useReducedMotion();
  const ov = overall(state, steps);
  const next = nextStep(state, steps);
  const streak = honestStreak(state.checkins);
  const hydrated = state.hydrated;
  const started = ov.done > 0;

  return (
    <div>
      <div style={{ background: skyGradient(stages) }} className="relative overflow-hidden">
        <div
          className="stars pointer-events-none absolute inset-x-0 top-0 h-[60rem] opacity-70"
          style={{ maskImage: "linear-gradient(to bottom, black, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent)" }}
          aria-hidden
        />

        {/* Hero */}
        <div className="relative mx-auto max-w-5xl px-5 pb-10 pt-14 text-center text-linen sm:pt-20">
          <p className="eyebrow !text-dawn">The conquest route</p>
          <h1 className="mx-auto mt-3 max-w-2xl text-[2.7rem] text-dawn-pale sm:text-6xl">
            Out of Egypt, into the land
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-linen/80">
            Eight stages. One road. Walk it at the pace of grace, and let the light grow as you go.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4">
            <div className="w-full">
              <div className="flex items-center justify-between text-xs font-semibold text-linen/70">
                <span>
                  {hydrated ? ov.done : 0} of {ov.total} steps sealed
                </span>
                <span>{hydrated ? Math.round(ov.pct * 100) : 0}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-dawn-deep to-dawn"
                  initial={false}
                  animate={{ width: `${hydrated ? Math.max(ov.pct * 100, 2) : 2}%` }}
                  transition={{ duration: reduce ? 0 : 1.6, ease: [0.22, 0.61, 0.36, 1] }}
                />
              </div>
            </div>
            {hydrated && next && (
              <Link href={stepHref(next)} className="btn btn-gold">
                {started ? "Continue" : "Begin the journey"}: {next.title} <IconArrow width={18} height={18} />
              </Link>
            )}
            {hydrated && streak > 0 && (
              <p className="text-sm text-dawn-pale">
                {streak} honest {streak === 1 ? "day" : "days"} in a row. That is what the lamp is for.
              </p>
            )}
          </div>
        </div>

        {/* Stages */}
        <div className="relative mx-auto max-w-5xl px-5 pb-24">
          {stages.map((st, i) => {
            const prog = stageProgress(state, steps, st.id);
            const prevComplete = i === 0 || stageProgress(state, steps, stages[i - 1].id).complete;
            const open = hydrated ? prevComplete : i === 0;
            const stageSteps = steps.filter((s) => s.stage === st.id);
            const current = next && next.stage === st.id;
            const left = i % 2 === 0;
            return (
              <div key={st.id}>
                <motion.article
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
                  className={`paper overflow-hidden lg:w-[56%] ${left ? "" : "lg:ml-auto"} ${open ? "" : "opacity-90"}`}
                  aria-labelledby={`stage-${st.id}`}
                >
                  <div className="relative">
                    <StageScene stage={st.id} className={`aspect-[16/8] w-full ${open ? "" : "saturate-50"}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                    <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-3 text-linen">
                      <span className="rounded-full bg-night/60 px-3 py-1 text-xs font-bold tracking-widest backdrop-blur">
                        STAGE {st.number}
                      </span>
                      {current && hydrated && (
                        <span className="chip !bg-dawn !text-night-deep">You are here</span>
                      )}
                      {prog.complete && (
                        <span className="chip !bg-olive !text-white">
                          <IconStone width={14} height={14} /> Stone laid
                        </span>
                      )}
                      {!open && (
                        <span className="chip !bg-night/70 !text-linen">
                          <IconLock width={13} height={13} /> Opens after {stages[i - 1].name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-7 pt-6">
                    <p className="eyebrow">{st.place}</p>
                    <h2 id={`stage-${st.id}`} className="mt-1.5 text-[2.3rem]">
                      {st.name}
                    </h2>
                    <p className="font-display text-[1.35rem] italic text-clay-deep">{st.subtitle}</p>
                    <p className="mt-3 text-[0.98rem] text-night/80">{st.blurb}</p>
                    <p className="mt-3 text-sm text-night/70">
                      The story: {st.story} <span className="whitespace-nowrap">({st.storyRef})</span>
                    </p>

                    {stageSteps.length > 0 ? (
                      <>
                        <ol className="mt-5 flex flex-wrap gap-2" aria-label={`${st.name} steps`}>
                          {stageSteps.map((s, k) => {
                            const sealed = isSealed(state, s.id);
                            const unlocked = hydrated ? isUnlocked(state, steps, s.id) : k === 0 && i === 0;
                            const base =
                              "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-500";
                            return (
                              <li key={s.id}>
                                {unlocked ? (
                                  <Link
                                    href={stepHref(s)}
                                    title={s.title}
                                    aria-label={sealed ? `${s.title} (sealed)` : `${k + 1}. ${s.title}`}
                                    className={`${base} ${
                                      sealed
                                        ? "border-olive bg-olive text-white"
                                        : "border-dawn-deep bg-dawn/40 text-night hover:bg-dawn"
                                    }`}
                                  >
                                    {sealed ? <IconCheck width={18} height={18} /> : k + 1}
                                  </Link>
                                ) : (
                                  <span
                                    role="img"
                                    title={`${s.title} (locked)`}
                                    aria-label={`${s.title}, locked`}
                                    className={`${base} border-night/15 bg-night/5 text-night/35`}
                                  >
                                    <IconLock width={15} height={15} />
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ol>
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <Link href={`/journey/${st.id}`} className={`btn ${open ? "btn-night" : "btn-ghost"}`}>
                            {open ? (prog.done > 0 && !prog.complete ? "Continue" : prog.complete ? "Revisit" : "Enter") : "Preview"}{" "}
                            {st.name} <IconArrow width={18} height={18} />
                          </Link>
                          <span className="text-sm font-semibold text-night/70">
                            {prog.done} of {prog.total} sealed
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="mt-5 inline-block rounded-full bg-night/5 px-4 py-2 text-sm font-semibold text-night/70">
                        Being written with care
                      </p>
                    )}
                  </div>
                </motion.article>
                {i < stages.length - 1 && <PathSegment fromLeft={left} done={prog.complete} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
