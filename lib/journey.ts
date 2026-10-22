import type { AppState } from "./store";

/** Lightweight description of a step. Client code gets this instead of the full content. */
export interface Step {
  id: string;
  stage: string;
  slug: string;
  title: string;
  tagline: string;
  order: number;
}

export const isSealed = (s: AppState, id: string) => !!s.milestones[id]?.sealed;

/** The first step is always open. Each step opens when the one before it is sealed. */
export function isUnlocked(s: AppState, steps: Step[], id: string) {
  const i = steps.findIndex((x) => x.id === id);
  if (i <= 0) return true;
  return isSealed(s, steps[i - 1].id);
}

export function stageProgress(s: AppState, steps: Step[], stageId: string) {
  const ms = steps.filter((m) => m.stage === stageId);
  const done = ms.filter((m) => isSealed(s, m.id)).length;
  return { done, total: ms.length, complete: ms.length > 0 && done === ms.length };
}

export function nextStep(s: AppState, steps: Step[]): Step | null {
  return steps.find((m) => !isSealed(s, m.id)) ?? null;
}

export function overall(s: AppState, steps: Step[]) {
  const done = steps.filter((m) => isSealed(s, m.id)).length;
  return { done, total: steps.length, pct: steps.length ? done / steps.length : 0 };
}

export const stepHref = (m: Pick<Step, "stage" | "slug">) => `/journey/${m.stage}/${m.slug}`;
