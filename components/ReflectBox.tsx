"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";

/** One journal entry per milestone. Autosaves. Private unless you choose to share. */
export function ReflectBox({ milestoneId, prompt }: { milestoneId: string; prompt: string }) {
  const { state, act } = useStore();
  const entryId = `reflect-${milestoneId}`;
  const existing = state.journal[entryId];
  const [text, setText] = useState("");
  const [shared, setShared] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const loaded = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (state.hydrated && !loaded.current) {
      loaded.current = true;
      setText(existing?.body ?? "");
      setShared(existing?.shared ?? false);
    }
  }, [state.hydrated, existing]);

  const save = (body: string, share: boolean) => {
    const now = new Date().toISOString();
    if (!body.trim() && !existing) return;
    act({
      type: "journal",
      entry: {
        id: entryId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        milestoneId,
        prompt,
        body,
        shared: share,
      },
    });
    setStatus("saved");
  };

  const onChange = (v: string) => {
    setText(v);
    setStatus("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(v, shared), 900);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div>
      <p className="font-display text-[1.45rem] italic leading-snug text-night">{prompt}</p>
      <label htmlFor={`reflect-${milestoneId}`} className="sr-only">
        Your reflection
      </label>
      <textarea
        id={`reflect-${milestoneId}`}
        className="field mt-4 min-h-40 resize-y font-scripture"
        placeholder="Write freely. This is between you and God."
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-night/75">
          <input
            type="checkbox"
            checked={shared}
            onChange={(e) => {
              setShared(e.target.checked);
              save(text, e.target.checked);
            }}
            className="h-4 w-4 accent-[#c8903f]"
          />
          Share this entry with my friend
        </label>
        <span className="text-night/70" aria-live="polite">
          {status === "saving" ? "Saving\u2026" : status === "saved" ? "Saved on this device" : "Private by default"}
        </span>
      </div>
    </div>
  );
}
