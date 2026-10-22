"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { StudyPlan } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { usePartner } from "@/lib/partner";
import { contextLink, Verse } from "./Verse";
import { Rich } from "./Rich";
import { IconArrow, IconBack, IconCheck } from "./Icons";

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
          <Link key={p.id} href={`/plans/${p.id}`} className="paper group flex flex-col px-6 py-6">
            <p className="eyebrow">{p.total} days</p>
            <p className="mt-1 font-display text-3xl leading-tight">{p.title}</p>
            <p className="mt-2 flex-1 text-night/75">{p.blurb}</p>
            <div className="mt-5" aria-hidden>
              <div className="h-2 overflow-hidden rounded-full bg-night/10">
                <div className="h-full rounded-full bg-gradient-to-r from-dawn to-dawn-deep transition-[width] duration-1000" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <p className="mt-2 flex items-center justify-between text-sm text-night/65">
              <span>
                {done} of {p.total} read
                {typeof theirs === "number" ? ` \u00b7 ${partnerName}: ${theirs}` : ""}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-night">
                {done ? "Continue" : "Begin"} <IconArrow width={15} height={15} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </p>
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
  const firstOpen = plan.days.find((d) => !mine.has(d.day))?.day ?? plan.days[plan.days.length - 1].day;
  const [open, setOpen] = useState<number | null>(null);
  const shownOpen = open ?? firstOpen;

  const toggle = (day: number) => {
    const next = new Set(mine);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    act({ type: "plan", plan: plan.id, days: Array.from(next).sort((a, b) => a - b) });
  };

  const done = mine.size;
  const pct = Math.round((done / plan.days.length) * 100);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/plans" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> All plans
      </Link>
      <p className="eyebrow mt-6">{plan.days.length}-day plan</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">{plan.title}</h1>
      <p className="mt-3 max-w-xl text-night/75">{plan.blurb}</p>

      <div className="mt-6">
        <div className="h-2.5 overflow-hidden rounded-full bg-night/10">
          <div className="h-full rounded-full bg-gradient-to-r from-dawn to-dawn-deep transition-[width] duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-night/65">
          {state.hydrated ? done : 0} of {plan.days.length} days
          {bundle?.partner ? ` \u00b7 ${partnerName}: ${theirs.size}` : ""}
        </p>
      </div>

      <ol className="mt-8 space-y-3">
        {plan.days.map((d) => {
          const isDone = mine.has(d.day);
          const isOpen = shownOpen === d.day;
          return (
            <li key={d.day} className={`paper overflow-hidden ${isDone ? "!bg-olive/10" : ""}`}>
              <button
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : d.day)}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isDone ? "bg-olive text-white" : "bg-dawn/30 text-night"
                  }`}
                >
                  {isDone ? <IconCheck width={16} height={16} /> : d.day}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-2xl leading-tight">{d.title}</span>
                  <span className="block text-sm text-night/70">{d.read}</span>
                </span>
                {theirs.has(d.day) && (
                  <span className="shrink-0 rounded-full bg-night/10 px-2.5 py-0.5 text-xs font-semibold text-night/70">
                    {partnerName} read it
                  </span>
                )}
              </button>
              {isOpen && (
                <div className="space-y-4 border-t border-night/10 px-5 pb-5 pt-4">
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
                        checked={isDone}
                        onChange={() => toggle(d.day)}
                      />
                      I read it
                    </label>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
