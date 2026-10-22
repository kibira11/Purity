"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Testimony } from "@/lib/types";
import type { VerseData } from "@/lib/verses";
import { uid, useStore } from "@/lib/store";
import { Verse } from "./Verse";
import { Rich } from "./Rich";
import { IconArrow } from "./Icons";

const KINDS: { id: "all" | Testimony["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "scripture", label: "In Scripture" },
  { id: "history", label: "Through history" },
  { id: "modern", label: "Today" },
];

const PROMPT = "My testimony";

function Card({ t, verse }: { t: Testimony; verse?: VerseData }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="paper overflow-hidden">
      <button
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          <span className="eyebrow block">{t.era}</span>
          <span className="block font-display text-[1.7rem] leading-tight">{t.name}</span>
          <span className="mt-1 block text-[0.98rem] text-night/70">{t.struggle}</span>
        </span>
        <span aria-hidden className={`mt-1.5 shrink-0 text-2xl text-night/70 transition-transform duration-500 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-night/10 px-5 pb-6 pt-5">
          <div className="prose-journey">
            {t.summary.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
          <div className="rounded-2xl bg-dawn/15 px-4 py-3">
            <p className="eyebrow">The turning</p>
            <p className="mt-1 text-night/85">
              <Rich text={t.turning} />
            </p>
          </div>
          {verse && <Verse data={verse} size="sm" showTabs={false} />}
          <a
            href={t.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-night underline decoration-dawn decoration-2 underline-offset-4"
          >
            Read the source: {t.sourceLabel} <IconArrow width={15} height={15} />
          </a>
        </div>
      )}
    </li>
  );
}

function YourStory() {
  const { state, act } = useStore();
  const [before, setBefore] = useState("");
  const [turning, setTurning] = useState("");
  const [now, setNow] = useState("");
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);

  const mine = useMemo(
    () =>
      Object.values(state.journal)
        .filter((e) => e.prompt === PROMPT)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [state.journal],
  );

  const save = () => {
    const parts = [
      before.trim() && `Before: ${before.trim()}`,
      turning.trim() && `The turning: ${turning.trim()}`,
      now.trim() && `Now: ${now.trim()}`,
    ].filter(Boolean);
    if (!parts.length) return;
    const stamp = new Date().toISOString();
    act({
      type: "journal",
      entry: { id: uid(), createdAt: stamp, updatedAt: stamp, prompt: PROMPT, body: parts.join("\n\n"), shared },
    });
    setBefore("");
    setTurning("");
    setNow("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="mt-14" aria-labelledby="your-story">
      <p className="eyebrow">Yours</p>
      <h2 id="your-story" className="mt-1 text-4xl">
        Write your own
      </h2>
      <p className="mt-3 max-w-2xl text-night/75">
        You do not need to be finished. Three short paragraphs. It is saved privately in your journal, and you choose
        whether your friend can read it. Leave out anything that would harm someone else.
      </p>
      <div className="paper mt-5 space-y-4 px-5 py-6 sm:px-7">
        <div>
          <label htmlFor="t-before" className="block font-semibold">
            Before: where I was
          </label>
          <textarea id="t-before" rows={3} className="field mt-1.5 font-scripture" value={before} onChange={(e) => setBefore(e.target.value)} />
        </div>
        <div>
          <label htmlFor="t-turning" className="block font-semibold">
            The turning: how God met me
          </label>
          <textarea id="t-turning" rows={3} className="field mt-1.5 font-scripture" value={turning} onChange={(e) => setTurning(e.target.value)} />
        </div>
        <div>
          <label htmlFor="t-now" className="block font-semibold">
            Now: what is different
          </label>
          <textarea id="t-now" rows={3} className="field mt-1.5 font-scripture" value={now} onChange={(e) => setNow(e.target.value)} />
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" className="h-5 w-5 accent-[#c8903f]" checked={shared} onChange={(e) => setShared(e.target.checked)} />
          Share with my friend (you can change this later)
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn btn-night" onClick={save} disabled={!before.trim() && !turning.trim() && !now.trim()}>
            Save my testimony
          </button>
          {saved && (
            <span className="text-sm text-olive-deep" role="status">
              Saved. It is in your{" "}
              <Link href="/journal" className="underline underline-offset-4">
                journal
              </Link>
              .
            </span>
          )}
        </div>
      </div>

      {mine.length > 0 && (
        <ul className="mt-6 space-y-3">
          {mine.map((e) => (
            <li key={e.id} className="paper px-5 py-4">
              <div className="flex items-center justify-between gap-2 text-xs text-night/70">
                <span>{new Date(e.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                <span className={`chip ${e.shared ? "!bg-olive/25" : ""}`}>{e.shared ? "Shared with my friend" : "Private"}</span>
              </div>
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap font-scripture text-night/85">{e.body}</p>
              <Link href="/journal" className="mt-2 inline-block text-sm font-semibold underline underline-offset-4">
                Edit or change who sees it
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TestimoniesView({
  testimonies,
  verses,
}: {
  testimonies: Testimony[];
  verses: Record<string, VerseData>;
}) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const list = testimonies.filter((t) => kind === "all" || t.kind === kind);
  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter testimonies">
        {KINDS.map((k) => (
          <button
            key={k.id}
            role="tab"
            aria-selected={kind === k.id}
            onClick={() => setKind(k.id)}
            className={`chip ${kind === k.id ? "!bg-night !text-dawn-pale" : ""}`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {list.map((t) => (
          <Card key={t.id} t={t} verse={t.verse ? verses[t.verse] : undefined} />
        ))}
      </ul>
      <YourStory />
    </div>
  );
}
