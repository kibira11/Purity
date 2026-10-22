"use client";

import Link from "next/link";
import type { Stage } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { isSealed, isUnlocked, stageProgress, stepHref, type Step } from "@/lib/journey";
import { StageScene } from "./StageScene";
import { Verse } from "./Verse";
import { Reveal } from "./Section";
import { IconArrow, IconBack, IconCheck, IconLock } from "./Icons";

export function StageView({
  stage,
  steps,
  allSteps,
  storyVerse,
  prevStage,
  nextStage,
}: {
  stage: Stage;
  steps: Step[];
  allSteps: Step[];
  storyVerse: VerseData;
  prevStage: Stage | null;
  nextStage: Stage | null;
}) {
  const { state } = useStore();
  const prog = stageProgress(state, allSteps, stage.id);

  return (
    <>
      <header className="relative overflow-hidden bg-night text-linen">
        <StageScene stage={stage.id} className="absolute inset-0 h-full w-full" title="" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-deep/90 via-night-deep/40 to-night-deep/10" />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-16 sm:pb-20 sm:pt-28">
          <Link href="/journey" className="inline-flex items-center gap-1.5 text-sm text-linen/75 hover:text-dawn-pale">
            <IconBack width={16} height={16} /> The map
          </Link>
          <p className="eyebrow mt-6 !text-dawn">
            Stage {stage.number} &middot; {stage.place}
          </p>
          <h1 className="mt-3 text-6xl text-dawn-pale sm:text-7xl">{stage.name}</h1>
          <p className="mt-2 font-display text-[1.7rem] italic text-linen/90">{stage.subtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-12">
        <Reveal>
          <p className="text-[1.12rem] text-night/85">{stage.blurb}</p>
          <div className="mt-6">
            <p className="eyebrow mb-3">The story we walk</p>
            <p className="mb-3 text-night/70">{stage.story}</p>
            <Verse data={storyVerse} size="sm" />
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl">The steps</h2>
            <span className="text-sm font-semibold text-night/70">
              {prog.done} of {prog.total} sealed
            </span>
          </div>
          <ol className="mt-5 space-y-3">
            {steps.map((s, k) => {
              const sealed = isSealed(state, s.id);
              const unlocked = state.hydrated ? isUnlocked(state, allSteps, s.id) : k === 0 && stage.number === 1;
              const body = (
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-xl font-bold ${
                      sealed
                        ? "border-olive bg-olive text-white"
                        : unlocked
                          ? "border-dawn-deep bg-dawn/40 text-night"
                          : "border-night/15 bg-night/5 text-night/35"
                    }`}
                  >
                    {sealed ? <IconCheck width={20} height={20} /> : unlocked ? k + 1 : <IconLock width={16} height={16} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1.45rem] leading-tight text-night">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-night/65">{s.tagline}</span>
                  </span>
                  {unlocked && <IconArrow className="shrink-0 text-night/70" width={20} height={20} />}
                </div>
              );
              return (
                <li key={s.id}>
                  {unlocked ? (
                    <Link
                      href={stepHref(s)}
                      className="paper block px-5 py-4 transition-transform duration-500 hover:-translate-y-0.5"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="paper px-5 py-4 opacity-60" aria-disabled>
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-between gap-3">
          {prevStage ? (
            <Link href={`/journey/${prevStage.id}`} className="btn btn-ghost">
              <IconBack width={18} height={18} /> {prevStage.name}
            </Link>
          ) : (
            <span />
          )}
          {nextStage && (
            <Link href={`/journey/${nextStage.id}`} className="btn btn-ghost">
              {nextStage.name} <IconArrow width={18} height={18} />
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
