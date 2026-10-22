"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { uid, useStore, type JournalEntry } from "@/lib/store";
import type { Step } from "@/lib/journey";
import { stepHref } from "@/lib/journey";
import { Reveal } from "./Section";

function EntryCard({ e, steps }: { e: JournalEntry; steps: Step[] }) {
  const { act } = useStore();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(e.body);
  const [confirm, setConfirm] = useState(false);
  const step = e.milestoneId ? steps.find((s) => s.id === e.milestoneId) : undefined;

  const save = (patch: Partial<JournalEntry>) =>
    act({ type: "journal", entry: { ...e, ...patch, updatedAt: new Date().toISOString() } });

  return (
    <li className="paper px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-night/70">
        <span>{new Date(e.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
        <span className={`chip ${e.shared ? "!bg-olive/25" : ""}`}>{e.shared ? "Shared with my friend" : "Private"}</span>
      </div>
      {e.prompt && <p className="mt-2 font-display text-[1.3rem] italic leading-snug text-night/70">{e.prompt}</p>}
      {step && (
        <Link href={stepHref(step)} className="text-sm text-dawn-deep underline underline-offset-4">
          From: {step.title}
        </Link>
      )}
      {editing ? (
        <>
          <textarea
            className="field mt-3 min-h-32 font-scripture"
            value={text}
            onChange={(ev) => setText(ev.target.value)}
            aria-label="Edit entry"
          />
          <div className="mt-2 flex gap-3">
            <button
              className="btn btn-night !min-h-0 !py-1.5"
              onClick={() => {
                save({ body: text });
                setEditing(false);
              }}
            >
              Save
            </button>
            <button className="btn btn-ghost !min-h-0 !py-1.5" onClick={() => { setText(e.body); setEditing(false); }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="mt-3 whitespace-pre-wrap font-scripture text-[1.05rem] leading-relaxed">{e.body || "(empty)"}</p>
      )}
      {!editing && (
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <button className="font-semibold underline underline-offset-4" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button className="underline underline-offset-4" onClick={() => save({ shared: !e.shared })}>
            {e.shared ? "Make private" : "Share with my friend"}
          </button>
          {confirm ? (
            <span>
              Delete for good?{" "}
              <button className="font-semibold text-clay-deep underline" onClick={() => act({ type: "journalDelete", id: e.id })}>
                Yes
              </button>{" "}
              <button className="underline" onClick={() => setConfirm(false)}>
                No
              </button>
            </span>
          ) : (
            <button className="text-clay-deep underline underline-offset-4" onClick={() => setConfirm(true)}>
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export function JournalView({ steps }: { steps: Step[] }) {
  const { state, act } = useStore();
  const [text, setText] = useState("");
  const [shared, setShared] = useState(false);
  const entries = useMemo(
    () => Object.values(state.journal).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [state.journal],
  );

  const add = () => {
    if (!text.trim()) return;
    const now = new Date().toISOString();
    act({ type: "journal", entry: { id: uid(), createdAt: now, updatedAt: now, body: text.trim(), shared } });
    setText("");
    setShared(false);
  };

  return (
    <div className="space-y-10">
      <Reveal className="paper px-6 py-7">
        <p className="eyebrow">New entry</p>
        <label htmlFor="new-entry" className="sr-only">
          Write a journal entry
        </label>
        <textarea
          id="new-entry"
          className="field mt-3 min-h-36 font-scripture"
          placeholder="What is on your heart? Write it out. No one reads this unless you share it."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-night/75">
            <input type="checkbox" className="h-4 w-4 accent-[#c8903f]" checked={shared} onChange={(e) => setShared(e.target.checked)} />
            Share with my friend
          </label>
          <button className="btn btn-gold" disabled={!text.trim()} onClick={add}>
            Save entry
          </button>
        </div>
      </Reveal>

      {state.hydrated && entries.length === 0 ? (
        <p className="text-center text-night/70">
          Nothing written yet. Your reflections from each step will appear here too.
        </p>
      ) : (
        <ul className="space-y-4">
          {entries.map((e) => (
            <EntryCard key={e.id} e={e} steps={steps} />
          ))}
        </ul>
      )}
    </div>
  );
}
