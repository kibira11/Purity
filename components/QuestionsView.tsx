"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { Verse } from "./Verse";
import { Rich } from "./Rich";
import { IconArrow } from "./Icons";

export function QuestionsView({
  questions,
  verses,
  titles,
}: {
  questions: Question[];
  verses: Record<string, VerseData>;
  /** "stage/slug" -> step title */
  titles: Record<string, string>;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return questions;
    return questions.filter((x) => `${x.q} ${x.short} ${x.answer.join(" ")}`.toLowerCase().includes(t));
  }, [q, questions]);

  return (
    <div>
      <div className="mt-8">
        <label htmlFor="q-search" className="sr-only">
          Search the questions
        </label>
        <input
          id="q-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: masturbation, wife, alcohol, fell again..."
          className="field max-w-xl"
        />
        <p className="mt-2 text-sm text-night/70" aria-live="polite">
          {list.length} {list.length === 1 ? "question" : "questions"}
        </p>
      </div>

      <ul className="mt-6 space-y-3">
        {list.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} id={item.id} className="paper scroll-mt-28 overflow-hidden">
              <h2 className="!text-base">
                <button
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                >
                  <span>
                    <span className="block font-display text-[1.65rem] leading-tight text-night">{item.q}</span>
                    {!isOpen && <span className="mt-1 block text-[0.98rem] font-normal text-night/70">{item.short}</span>}
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1.5 shrink-0 text-2xl text-night/70 transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h2>
              {isOpen && (
                <div id={`${item.id}-panel`} className="space-y-5 border-t border-night/10 px-5 pb-6 pt-5">
                  <p className="font-display text-2xl italic leading-snug text-night/80">{item.short}</p>
                  <div className="prose-journey">
                    {item.answer.map((p, i) => (
                      <p key={i}>
                        <Rich text={p} />
                      </p>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {item.verses.map((r) => (
                      <Verse key={r} data={verses[r] ?? { ref: r }} size="sm" showTabs={false} />
                    ))}
                  </div>
                  <div>
                    <p className="eyebrow">Go deeper in the journey</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {item.stages.map((s) => (
                        <li key={`${s.stage}/${s.slug}`}>
                          <Link href={`/journey/${s.stage}/${s.slug}`} className="chip inline-flex items-center gap-1.5">
                            {titles[`${s.stage}/${s.slug}`] ?? s.slug} <IconArrow width={14} height={14} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="mt-8 text-night/70">Nothing matched. Try a simpler word.</p>}
    </div>
  );
}
