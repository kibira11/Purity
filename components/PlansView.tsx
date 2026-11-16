"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { StudyPlan } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { usePartner } from "@/lib/partner";
import { contextLink, Verse } from "./Verse";
import { Rich } from "./Rich";
import { IconArrow, IconBack, IconCheck } from "./Icons";
import { Book, type BookHandle, type BookPage } from "./book/Book";
import { GoldDust } from "./book/GoldDust";

type PlanSummary = Pick<StudyPlan, "id" | "title" | "blurb"> & { total: number };

export function PlansIndex({ plans }: { plans: PlanSummary[] }) {
  const { state } = useStore();
  const { bundle } = usePartner();
  const partnerName = bundle?.partner?.name || "Your friend";
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {plans.map((p) => {
        const done = state.hydrated ? (state.plans[p.id]?.length ?? 0) : 0;
        const theirs = bundle?.partner?.plans?.[p.id]?.length;
        const pct = Math.round((done / p.total) * 100);
        return (
          <Link key={p.id} href={`/plans/${p.id}`} className="group flex gap-4">
            <motion.div
              className="book-spine flex-shrink-0 font-display text-lg font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              {p.total}d
            </motion.div>
            <motion.div className="paper flex flex-1 flex-col px-6 py-6" whileHover={{ y: -2 }}>
              <p className="eyebrow">{p.total} days</p>
              <p className="mt-1 font-display text-3xl leading-tight">{p.title}</p>
              <p className="mt-2 flex-1 text-night/75">{p.blurb}</p>
              <div className="mt-5" aria-hidden>
                <div className="h-2 overflow-hidden rounded-full bg-night/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-dawn to-dawn-deep transition-[width] duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 flex items-center justify-between text-sm text-night/65">
                <span>
                  {done} of {p.total} read
                  {typeof theirs === "number" ? ` \u00b7 ${partnerName}: ${theirs}` : ""}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-night">
                  {done ? "Continue" : "Begin"}{" "}
                  <IconArrow width={15} height={15} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </p>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export function PlanView({ plan, verses }: { plan: StudyPlan; verses: Record<string, VerseData> }) {
  const { state, act } = useStore();
  const { bundle } = usePartner();
  const mine = useMemo(() => new Set(state.plans[plan.id] ?? []), [state.plans, plan.id]);
  const theirs = useMemo(() => new Set(bundle?.partner?.plans?.[plan.id] ?? []), [bundle, plan.id]);
  const partnerName = bundle?.partner?.name || "Your friend";
  const firstOpen = plan.days.find((d) => !mine.has(d.day))?.day ?? plan.days[0].day;
  const [sparkle, setSparkle] = useState(false);
  const bookRef = useRef<BookHandle>(null);

  const toggle = useCallback(
    (day: number) => {
      const next = new Set(mine);
      const adding = !next.has(day);
      if (adding) next.add(day);
      else next.delete(day);
      act({ type: "plan", plan: plan.id, days: Array.from(next).sort((a, b) => a - b) });
      if (adding) {
        setSparkle(true);
        window.setTimeout(() => setSparkle(false), 1400);
      }
    },
    [act, mine, plan.id],
  );

  const done = mine.size;
  const pct = Math.round((done / plan.days.length) * 100);

  const pages: BookPage[] = useMemo(
    () =>
      plan.days.map((d) => ({
        id: `day-${d.day}`,
        title: d.title,
        eyebrow: `Day ${d.day} · ${d.read}`,
        content: (
          <div className="space-y-4">
            {verses[d.verse] && <Verse data={verses[d.verse]} size="sm" />}
            <p className="text-[1.02rem] text-night/85">
              <Rich text={d.focus} />
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={contextLink(d.read)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !min-h-0 !py-2"
              >
                Read {d.read}
              </a>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-night">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-[#c8903f]"
                  checked={mine.has(d.day)}
                  onChange={() => toggle(d.day)}
                />
                I read it
              </label>
              {theirs.has(d.day) && (
                <span className="rounded-full bg-night/10 px-2.5 py-0.5 text-xs font-semibold text-night/70">
                  {partnerName} read it
                </span>
              )}
            </div>
            {mine.has(d.day) && (
              <p className="flex items-center gap-2 text-sm font-semibold text-olive-deep">
                <span className="wax-seal">
                  <IconCheck width={14} height={14} />
                </span>
                Day sealed. Turn the page when you are ready.
              </p>
            )}
          </div>
        ),
      })),
    [mine, partnerName, plan.days, theirs, toggle, verses],
  );

  const cover = (
    <>
      <p className="eyebrow text-center">{plan.days.length}-day plan</p>
      <h1 className="mt-3 text-center text-4xl sm:text-5xl">{plan.title}</h1>
      <p className="mx-auto mt-4 max-w-md text-center text-night/75">{plan.blurb}</p>
      <div className="mx-auto mt-6 max-w-sm">
        <div className="h-2.5 overflow-hidden rounded-full bg-night/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-dawn to-dawn-deep transition-[width] duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-night/65">
          {state.hydrated ? done : 0} of {plan.days.length} days
          {bundle?.partner ? ` · ${partnerName}: ${theirs.size}` : ""}
        </p>
      </div>
    </>
  );

  const backCover = (
    <div className="text-center">
      <GoldDust active={sparkle} />
      <h2 className="text-3xl">{done === plan.days.length ? "Plan complete" : "Keep turning pages"}</h2>
      <p className="mt-2 text-night/70">
        {done === plan.days.length
          ? "You walked the whole road. Consider starting a study group and walking it with others."
          : "Missing a day is not failure. Pick up on the next page."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/plans" className="btn btn-ghost">
          <IconBack width={16} height={16} /> All plans
        </Link>
        <Link href="/study" className="btn btn-gold">
          Bible studies <IconArrow width={16} height={16} />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/plans" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> All plans
      </Link>
      <Book
        ref={bookRef}
        bookId={`plan-${plan.id}`}
        pages={pages}
        cover={cover}
        backCover={backCover}
        initialPageId={`day-${firstOpen}`}
        nudgeTurn={sparkle}
      />
    </div>
  );
}