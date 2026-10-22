"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Artwork, Milestone } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { isSealed, isUnlocked, stageProgress, stepHref, type Step } from "@/lib/journey";
import { Section, Reveal } from "./Section";
import { RichParagraphs, Rich } from "./Rich";
import { Verse } from "./Verse";
import { StageScene } from "./StageScene";
import { ReflectBox } from "./ReflectBox";
import { VerseBuilder } from "./games/VerseBuilder";
import { ThreadMatch } from "./games/ThreadMatch";
import { CrossroadsGame } from "./games/Crossroads";
import { ArmorGame } from "./games/ArmorGame";
import { IconArrow, IconBack, IconCheck, IconLock, IconStone } from "./Icons";
import type { Scenario } from "@/content/crossroads";

const tabs = [
  { id: "word", label: "The Word" },
  { id: "revelation", label: "Revelation" },
  { id: "thread", label: "Golden Thread" },
  { id: "voices", label: "Voices" },
  { id: "mind", label: "Mind and Brain" },
  { id: "body", label: "Body" },
  { id: "challenge", label: "Challenge" },
  { id: "reflect", label: "Reflect" },
  { id: "play", label: "Play" },
];

function StepTracker() {
  const [active, setActive] = useState("word");
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav
      aria-label="In this step"
      className="sticky top-[57px] z-30 -mx-5 overflow-x-auto border-b border-night/10 bg-linen/90 px-5 py-2 backdrop-blur-md [scrollbar-width:none] lg:top-[57px]"
    >
      <ul className="mx-auto flex max-w-3xl gap-1.5">
        {tabs.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              className={`block whitespace-nowrap rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors duration-500 ${
                active === t.id ? "bg-night text-dawn-pale" : "text-night/70 hover:bg-night/5"
              }`}
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface MilestoneViewProps {
  m: Milestone;
  stage: { id: string; name: string; number: number; subtitle: string; storyRef: string };
  position: { index: number; total: number };
  verses: Record<string, VerseData>;
  steps: Step[];
  scenario?: Scenario;
  art?: Artwork | null;
}

export function MilestoneView({ m, stage, position, verses, steps, scenario, art }: MilestoneViewProps) {
  const { state, act } = useStore();
  const reduce = useReducedMotion();
  const prog = state.milestones[m.id];
  const sealed = isSealed(state, m.id);
  const unlocked = isUnlocked(state, steps, m.id);
  const i = steps.findIndex((s) => s.id === m.id);
  const prev = i > 0 ? steps[i - 1] : null;
  const next = i >= 0 && i < steps.length - 1 ? steps[i + 1] : null;
  const [celebrate, setCelebrate] = useState(false);

  const onWin = useCallback(() => act({ type: "milestone", id: m.id, patch: { gameWon: true } }), [act, m.id]);

  const header = (
    <header className="relative overflow-hidden bg-night text-linen">
      <StageScene stage={stage.id} className="absolute inset-0 h-full w-full" title="" />
      <div className="absolute inset-0 bg-gradient-to-t from-night-deep/90 via-night-deep/45 to-night-deep/20" />
      <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-16 sm:pb-16 sm:pt-24">
        <Link
          href="/journey"
          className="inline-flex items-center gap-1.5 text-sm text-linen/75 transition-colors hover:text-dawn-pale"
        >
          <IconBack width={16} height={16} /> The map
        </Link>
        <p className="eyebrow mt-6 !text-dawn">
          Stage {stage.number} &middot; {stage.name} &middot; Step {position.index} of {position.total}
        </p>
        <h1 className="mt-3 text-[2.6rem] text-dawn-pale sm:text-6xl">{m.title}</h1>
        <p className="mt-4 max-w-xl font-display text-[1.5rem] italic leading-snug text-linen/90">{m.tagline}</p>
      </div>
    </header>
  );

  if (!state.hydrated) {
    return (
      <>
        {header}
        <div className="mx-auto max-w-3xl px-5 py-16 text-night/70">Lighting the lamp&hellip;</div>
      </>
    );
  }

  if (!unlocked && prev) {
    return (
      <>
        {header}
        <div className="mx-auto max-w-xl px-5 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-night text-dawn">
            <IconLock />
          </div>
          <h2 className="mt-5 text-3xl">Not yet, and that is a mercy</h2>
          <p className="mt-3 text-night/75">
            This step opens once you have sealed <strong>{prev.title}</strong>. Freedom is built stone by stone,
            and the walls you build in order are the ones that hold.
          </p>
          <Link href={stepHref(prev)} className="btn btn-gold mt-7">
            Go to the step before <IconArrow width={18} height={18} />
          </Link>
        </div>
      </>
    );
  }

  const keyData = verses[m.keyVerse];
  const gameRef = m.game.type === "builder" ? (m.game.ref ?? m.keyVerse) : m.keyVerse;

  const seal = () => {
    act({ type: "milestone", id: m.id, patch: { sealed: true } });
    setCelebrate(true);
  };

  const stageDone = (() => {
    // After sealing this one, is the stage complete?
    const sp = stageProgress(state, steps, stage.id);
    return sp.complete;
  })();

  return (
    <>
      {header}
      <div className="mx-auto max-w-3xl px-5">
        <StepTracker />

        <div className="space-y-14 py-12">
          <Section id="word" eyebrow="The Word" title={m.keyVerse}>
            <Verse data={keyData} />
            {m.alsoRead && m.alsoRead.length > 0 && (
              <details className="group mt-4 rounded-2xl border border-night/10 bg-white/50 px-5 py-3">
                <summary className="cursor-pointer list-none text-sm font-semibold text-night/80 marker:hidden">
                  <span className="mr-2 inline-block transition-transform duration-500 group-open:rotate-90">&rsaquo;</span>
                  Also read: {m.alsoRead.join(" \u00b7 ")}
                </summary>
                <div className="mt-4 space-y-4 pb-2">
                  {m.alsoRead.map((r) => (
                    <Verse key={r} data={verses[r]} size="sm" showTabs={false} />
                  ))}
                </div>
              </details>
            )}
          </Section>

          <Section id="revelation" eyebrow="Revelation" title="What this is really saying">
            <RichParagraphs paragraphs={m.revelation} className="text-[1.1rem]" />
            {art && (
              <figure className="mt-8 overflow-hidden rounded-2xl border border-night/10 bg-night">
                <Image
                  src={`/art/${art.file}`}
                  alt={`${art.title} by ${art.artist}`}
                  width={1200}
                  height={800}
                  className="h-auto max-h-[28rem] w-full object-cover"
                />
                <figcaption className="px-5 py-3 text-sm text-linen/80">
                  <span className="font-semibold text-dawn-pale">{art.title}</span>, {art.artist}, {art.date}.{" "}
                  <Link href="/gallery" className="underline underline-offset-4 hover:text-dawn-pale">
                    The story behind it
                  </Link>
                </figcaption>
              </figure>
            )}
          </Section>

          <Section id="thread" eyebrow="The Golden Thread" title="Scripture explains Scripture" tone="paper">
            <ol className="space-y-6">
              {m.thread.map((t, idx) => (
                <li key={t.ref} className="grid gap-3 sm:grid-cols-[2.2rem_1fr]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dawn/30 font-display text-lg font-bold text-night">
                    {idx + 1}
                  </span>
                  <div>
                    <Verse data={verses[t.ref]} size="sm" showTabs={false} />
                    <p className="mt-2.5 px-1 text-[1rem] text-night/80">
                      <Rich text={t.note} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="voices" eyebrow="Voices" title="Go deeper with those who walked it">
            <ul className="space-y-4">
              {m.voices.map((v) => (
                <li key={v.work} className="paper px-6 py-5">
                  <p className="font-display text-[1.45rem] leading-tight text-night">{v.who}</p>
                  <p className="text-sm font-semibold text-dawn-deep">{v.work}</p>
                  <p className="mt-2 text-[1rem] text-night/80">
                    <Rich text={v.note} />
                  </p>
                  {v.url && (
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-night underline decoration-dawn decoration-2 underline-offset-4"
                    >
                      Read or listen <IconArrow width={15} height={15} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="mind" eyebrow="Mind and Brain" title={m.mind.title} tone="night">
            <div className="prose-journey text-[1.05rem] text-linen/90 [&_strong]:text-dawn-pale">
              {m.mind.body.map((p, k) => (
                <p key={k}>
                  <Rich text={p} />
                </p>
              ))}
            </div>
            <p className="mt-5 border-t border-linen/15 pt-4 text-sm text-linen/65">
              Source: {m.mind.source}.{" "}
              {m.mind.sourceUrl && (
                <a
                  href={m.mind.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-dawn underline underline-offset-4"
                >
                  Read more
                </a>
              )}
            </p>
          </Section>

          <Section id="body" eyebrow="Body practice" title={m.body.title} tone="paper">
            <p className="text-[1.08rem] leading-relaxed text-night/85">
              <Rich text={m.body.body} />
            </p>
          </Section>

          <Section id="challenge" eyebrow="Challenge" title={m.challenge.title}>
            <div className="paper border-dawn/40 px-6 py-6">
              <p className="text-[1.08rem] text-night/85">
                <Rich text={m.challenge.body} />
              </p>
              <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl bg-dawn/20 px-4 py-3 font-semibold text-night">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#c8903f]"
                  checked={!!prog?.challengeDone}
                  onChange={(e) => act({ type: "milestone", id: m.id, patch: { challengeDone: e.target.checked } })}
                />
                I did it
              </label>
            </div>
          </Section>

          <Section id="reflect" eyebrow="Reflect" title="Write it down" tone="paper">
            <ReflectBox milestoneId={m.id} prompt={m.reflect} />
          </Section>

          <Section id="play" eyebrow="Play" title="Make it stick" tone="night">
            {m.game.type === "crossroads" && scenario ? (
              <CrossroadsGame scenario={scenario} verses={verses} onWin={onWin} />
            ) : m.game.type === "armor" ? (
              <ArmorGame verses={verses} onWin={onWin} alreadyWon={!!prog?.gameWon} />
            ) : m.game.type === "thread" ? (
              <ThreadMatch
                pairs={m.thread.map((t) => ({ ref: t.ref, note: t.note, verse: verses[t.ref] }))}
                keyRef={m.keyVerse}
                onWin={onWin}
              />
            ) : (
              <VerseBuilder verse={verses[gameRef]} onWin={onWin} alreadyWon={!!prog?.gameWon} />
            )}
          </Section>

          <Reveal>
            <div className="paper px-6 py-8 text-center sm:px-10">
              {sealed ? (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive text-white">
                    <IconCheck />
                  </div>
                  <h2 className="mt-4 text-3xl">This step is sealed</h2>
                  <p className="mt-2 text-night/70">Well walked. Take a breath before the next one.</p>
                </>
              ) : prog?.gameWon ? (
                <>
                  <h2 className="text-3xl">Ready to seal this step?</h2>
                  <p className="mx-auto mt-2 max-w-md text-night/70">
                    Sealing means you have read it, felt it, and played it. The next step opens.
                  </p>
                  <button className="btn btn-gold mt-6" onClick={seal}>
                    Seal this step <IconCheck width={18} height={18} />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl">One thing left</h2>
                  <p className="mx-auto mt-2 max-w-md text-night/70">
                    Finish the game above and you can seal this step and open the next.
                  </p>
                  <a href="#play" className="btn btn-night mt-6">
                    Back to the game
                  </a>
                </>
              )}

              {(sealed || celebrate) && stageDone && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="night-panel stars mx-auto mt-8 max-w-md px-6 py-7"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dawn text-night-deep">
                    <IconStone />
                  </div>
                  <p className="mt-3 font-display text-3xl text-dawn-pale">A stone of remembrance</p>
                  <p className="mt-2 text-sm text-linen/80">
                    You crossed {stage.name}. Like Israel at the Jordan, you now set a stone, so when you are asked
                    &ldquo;what do these stones mean?&rdquo; you can say: <em>God brought me through.</em>
                  </p>
                  <Link href="/stones" className="btn btn-gold mt-5">
                    See your stones
                  </Link>
                </motion.div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {prev && (
                  <Link href={stepHref(prev)} className="btn btn-ghost">
                    <IconBack width={18} height={18} /> {prev.title}
                  </Link>
                )}
                {next && sealed && (
                  <Link href={stepHref(next)} className="btn btn-night">
                    {next.title} <IconArrow width={18} height={18} />
                  </Link>
                )}
                {!next && sealed && (
                  <Link href="/journey" className="btn btn-night">
                    Back to the map
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
