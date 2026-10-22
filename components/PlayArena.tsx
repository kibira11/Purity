"use client";

import { useCallback, useMemo, useState } from "react";
import type { Scenario } from "@/content/crossroads";
import type { VerseData } from "@/lib/verses";
import { useStore } from "@/lib/store";
import { CrossroadsGame } from "./games/Crossroads";
import { ArmorGame } from "./games/ArmorGame";
import { VerseBuilder } from "./games/VerseBuilder";
import { ThreadMatch, type ThreadPair } from "./games/ThreadMatch";

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="night-panel stars px-5 py-6 sm:px-8 sm:py-8">{children}</div>;
}

export function PlayCrossroads({
  scenarios,
  verses,
  stageNames,
}: {
  scenarios: Scenario[];
  verses: Record<string, VerseData>;
  stageNames: Record<string, string>;
}) {
  const [id, setId] = useState(scenarios[0]?.id);
  const scenario = scenarios.find((s) => s.id === id) ?? scenarios[0];
  const noop = useCallback(() => {}, []);
  return (
    <div>
      <div role="tablist" aria-label="Choose a scene" className="flex flex-wrap gap-2">
        {scenarios.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={s.id === id}
            onClick={() => setId(s.id)}
            className={`chip ${s.id === id ? "!bg-night !text-dawn-pale" : ""}`}
          >
            {s.title}
          </button>
        ))}
      </div>
      {scenario?.stage && (
        <p className="mt-3 text-sm text-night/70">From the {stageNames[scenario.stage] ?? scenario.stage} stage.</p>
      )}
      <div className="mt-4">
        <Stage>
          <CrossroadsGame key={scenario.id} scenario={scenario} verses={verses} onWin={noop} />
        </Stage>
      </div>
    </div>
  );
}

export function PlayArmor({ verses }: { verses: Record<string, VerseData> }) {
  const { act } = useStore();
  const onWin = useCallback(() => {
    act({ type: "armor", pieces: ["belt", "breastplate", "shoes", "shield", "helmet", "sword", "prayer"] });
  }, [act]);
  return (
    <Stage>
      <ArmorGame verses={verses} onWin={onWin} />
    </Stage>
  );
}

export interface PlayVerseOption {
  ref: string;
  stage: string;
}

export function PlayVerses({
  options,
  verses,
  stageNames,
}: {
  options: PlayVerseOption[];
  verses: Record<string, VerseData>;
  stageNames: Record<string, string>;
}) {
  const [ref, setRef] = useState(options[0]?.ref ?? "");
  const noop = useCallback(() => {}, []);
  const grouped = useMemo(() => {
    const m = new Map<string, PlayVerseOption[]>();
    for (const o of options) m.set(o.stage, [...(m.get(o.stage) ?? []), o]);
    return Array.from(m.entries());
  }, [options]);
  return (
    <div>
      <label className="block text-sm font-semibold text-night/80" htmlFor="verse-pick">
        Choose a verse
      </label>
      <select
        id="verse-pick"
        value={ref}
        onChange={(e) => setRef(e.target.value)}
        className="field mt-2 max-w-sm"
      >
        {grouped.map(([stage, opts]) => (
          <optgroup key={stage} label={stageNames[stage] ?? stage}>
            {opts.map((o) => (
              <option key={o.ref} value={o.ref}>
                {o.ref}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="mt-5">
        <Stage>
          {verses[ref] ? (
            <VerseBuilder key={ref} verse={verses[ref]} onWin={noop} />
          ) : (
            <p className="text-linen/80">That verse is still being prepared.</p>
          )}
        </Stage>
      </div>
    </div>
  );
}

export interface PlayThreadStep {
  id: string;
  title: string;
  stage: string;
  keyRef: string;
  pairs: ThreadPair[];
}

export function PlayThreads({
  steps,
  stageNames,
}: {
  steps: PlayThreadStep[];
  stageNames: Record<string, string>;
}) {
  const [id, setId] = useState(steps[0]?.id);
  const step = steps.find((s) => s.id === id) ?? steps[0];
  const noop = useCallback(() => {}, []);
  const grouped = useMemo(() => {
    const m = new Map<string, PlayThreadStep[]>();
    for (const s of steps) m.set(s.stage, [...(m.get(s.stage) ?? []), s]);
    return Array.from(m.entries());
  }, [steps]);
  return (
    <div>
      <label className="block text-sm font-semibold text-night/80" htmlFor="thread-pick">
        Choose a step
      </label>
      <select id="thread-pick" value={id} onChange={(e) => setId(e.target.value)} className="field mt-2 max-w-md">
        {grouped.map(([stage, list]) => (
          <optgroup key={stage} label={stageNames[stage] ?? stage}>
            {list.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <div className="mt-5">
        <Stage>
          <ThreadMatch key={step.id} pairs={step.pairs} keyRef={step.keyRef} onWin={noop} />
        </Stage>
      </div>
    </div>
  );
}
