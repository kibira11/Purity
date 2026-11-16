"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Artwork, Milestone } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { isSealed, isUnlocked, stageProgress, stepHref, type Step } from "@/lib/journey";
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
import { Book, type BookHandle, type BookPage } from "./book/Book";
import { GoldDust } from "./book/GoldDust";

const pageMeta = [
  { id: "word", eyebrow: "The Word", label: "The Word" },
  { id: "revelation", eyebrow: "Revelation", label: "What this is really saying" },
  { id: "thread", eyebrow: "Golden Thread", label: "Scripture explains Scripture" },
  { id: "voices", eyebrow: "Voices", label: "Go deeper with those who walked it" },
  { id: "mind", eyebrow: "Mind and Brain", label: "Mind and Brain" },
  { id: "body", eyebrow: "Body practice", label: "Body" },
  { id: "challenge", eyebrow: "Challenge", label: "Challenge" },
  { id: "reflect", eyebrow: "Reflect", label: "Write it down" },
  { id: "play", eyebrow: "Play", label: "Make it stick" },
] as const;

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
  const bookRef = useRef<BookHandle>(null);

  const onWin = useCallback(() => act({ type: "milestone", id: m.id, patch: { gameWon: true } }), [act, m.id]);

  const keyData = verses[m.keyVerse];
  const gameRef = m.game.type === "builder" ? (m.game.ref ?? m.keyVerse) : m.keyVerse;

  const seal = () => {
    act({ type: "milestone", id: m.id, patch: { sealed: true } });
    setCelebrate(true);
  };

  const stageDone = stageProgress(state, steps, stage.id).complete;
  const nudgeTurn = !!prog?.challengeDone || !!prog?.gameWon;

  const pages: BookPage[] = useMemo(() => {
    const playBlock =
      m.game.type === "crossroads" && scenario ? (
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
      );

    return [
      {
        id: "word",
        title: m.keyVerse,
        eyebrow: "The Word",
        content: (
          <>
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
          </>
        ),
      },
      {
        id: "revelation",
        title: "What this is really saying",
        eyebrow: "Revelation",
        content: (
          <>
            <div className="drop-cap text-[1.1rem]">
              <RichParagraphs paragraphs={m.revelation} className="text-[1.1rem]" />
            </div>
            {art && (
              <figure className="mt-8 overflow-hidden rounded-2xl border border-night/10 bg-night">
                <Image
                  src={`/art/${art.file}`}
                  alt={`${art.title} by ${art.artist}`}
                  width={1200}
                  height={800}
                  className="h-auto max-h-[24rem] w-full object-cover"
                />
                <figcaption className="px-5 py-3 text-sm text-linen/80">
                  <span className="font-semibold text-dawn-pale">{art.title}</span>, {art.artist}, {art.date}.{" "}
                  <Link href="/gallery" className="underline underline-offset-4 hover:text-dawn-pale">
                    The story behind it
                  </Link>
                </figcaption>
              </figure>
            )}
          </>
        ),
      },
      {
        id: "thread",
        title: "Scripture explains Scripture",
        eyebrow: "Golden Thread",
        content: (
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
        ),
      },
      {
        id: "voices",
        title: "Go deeper with those who walked it",
        eyebrow: "Voices",
        content: (
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
        ),
      },
      {
        id: "mind",
        title: m.mind.title,
        eyebrow: "Mind and Brain",
        content: (
          <div className="night-panel stars px-5 py-6 sm:px-8">
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
                <a href={m.mind.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-dawn underline underline-offset-4">
                  Read more
                </a>
              )}
            </p>
          </div>
        ),
      },
      {
        id: "body",
        title: m.body.title,
        eyebrow: "Body practice",
        content: (
          <div className="paper px-6 py-6">
            <p className="text-[1.08rem] leading-relaxed text-night/85">
              <Rich text={m.body.body} />
            </p>
          </div>
        ),
      },
      {
        id: "challenge",
        title: m.challenge.title,
        eyebrow: "Challenge",
        content: (
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
        ),
      },
      {
        id: "reflect",
        title: "Write it down",
        eyebrow: "Reflect",
        content: (
          <div className="paper px-5 py-5 sm:px-7">
            <ReflectBox milestoneId={m.id} prompt={m.reflect} />
          </div>
        ),
      },
      {
        id: "play",
        title: "Make it stick",
        eyebrow: "Play",
        content: <div className="night-panel stars px-5 py-6 sm:px-8">{playBlock}</div>,
      },
    ];
  }, [act, art, gameRef, keyData, m, onWin, prog?.challengeDone, prog?.gameWon, scenario, verses]);

  const cover = (
    <div className="relative -mx-6 -mt-10 overflow-hidden rounded-t-xl sm:-mx-12">
      <StageScene stage={stage.id} className="h-48 w-full sm:h-56" title="" />
      <div className="absolute inset-0 bg-gradient-to-t from-parchment via-parchment/80 to-transparent" />
      <div className="relative px-2 pt-28 text-center sm:pt-32">
        <p className="eyebrow">
          Stage {stage.number} &middot; {stage.name}
        </p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{m.title}</h1>
        <p className="ornament mt-4">
          <span className="font-display text-xl italic text-night/80">{m.tagline}</span>
        </p>
        <p className="mt-4 text-sm text-night/65">
          Step {position.index} of {position.total} &middot; {pageMeta.length} pages to turn
        </p>
      </div>
    </div>
  );

  const backCover = (
    <div className="relative text-center">
      <GoldDust active={celebrate} />
      <div className="paper px-6 py-8 text-center sm:px-10">
        {sealed ? (
          <>
            <span className="wax-seal mx-auto" aria-hidden>
              <IconCheck width={18} height={18} />
            </span>
            <h2 className="mt-4 text-3xl">This step is sealed</h2>
            <p className="mt-2 text-night/70">Well walked. Take a breath before the next one.</p>
          </>
        ) : prog?.gameWon ? (
          <>
            <h2 className="text-3xl">Ready to seal this step?</h2>
            <p className="mx-auto mt-2 max-w-md text-night/70">
              Sealing means you have read it, felt it, and played it. The next step opens.
            </p>
            <button type="button" className="btn btn-gold mt-6" onClick={seal}>
              Seal this step <IconCheck width={18} height={18} />
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl">One thing left</h2>
            <p className="mx-auto mt-2 max-w-md text-night/70">
              Finish the game on the Play page, then return here to seal this step.
            </p>
            <button type="button" className="btn btn-night mt-6" onClick={() => bookRef.current?.goToPageId("play")}>
              Back to the game
            </button>
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
    </div>
  );

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

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-night/10 bg-linen/92 backdrop-blur-md">
        <motion.div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-2" initial={false}>
          <Link href="/journey" className="inline-flex items-center gap-1.5 text-sm font-semibold text-night/75 hover:text-night">
            <IconBack width={16} height={16} /> Map
          </Link>
          <p className="text-sm font-semibold text-night/70">{m.title}</p>
          <Link href="/flee" className="text-sm font-semibold text-clay-deep hover:text-clay">
            Flee
          </Link>
        </motion.div>
      </div>

      <div className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <Book
          ref={bookRef}
          bookId={`milestone-${m.id}`}
          pages={pages}
          cover={cover}
          backCover={backCover}
          nudgeTurn={nudgeTurn && !sealed}
        />
      </div>
    </>
  );
}