import type { Milestone } from "@/lib/types";
import type { Step } from "@/lib/journey";
import { stages } from "./stages";
import { armorRefs } from "./armor";
import { egypt } from "./stages/egypt";
import { passover } from "./stages/passover";
import { redSea } from "./stages/redsea";
import { wilderness } from "./stages/wilderness";
import { sinai } from "./stages/sinai";
import { jordan } from "./stages/jordan";
import { promisedLand } from "./stages/promised-land";
import { zion } from "./stages/zion";

const byStage: Record<string, Milestone[]> = {
  egypt,
  passover,
  "red-sea": redSea,
  wilderness,
  sinai,
  jordan,
  "promised-land": promisedLand,
  zion,
};

export const allMilestones: Milestone[] = stages.flatMap((s) =>
  (byStage[s.id] ?? []).slice().sort((a, b) => a.order - b.order),
);

export const allSteps: Step[] = allMilestones.map(({ id, stage, slug, title, tagline, order }) => ({
  id,
  stage,
  slug,
  title,
  tagline,
  order,
}));

export const stageMilestones = (stageId: string) => allMilestones.filter((m) => m.stage === stageId);

export const getMilestone = (stage: string, slug: string) =>
  allMilestones.find((m) => m.stage === stage && m.slug === slug);

export const milestoneById = (id: string) => allMilestones.find((m) => m.id === id);

export const indexOfMilestone = (id: string) => allMilestones.findIndex((m) => m.id === id);

export const neighbors = (id: string) => {
  const i = indexOfMilestone(id);
  return { prev: i > 0 ? allMilestones[i - 1] : null, next: i >= 0 && i < allMilestones.length - 1 ? allMilestones[i + 1] : null };
};

/** All scripture references used by a milestone, for server-side lookup. */
export const refsForMilestone = (m: Milestone): string[] => {
  const refs = new Set<string>([m.keyVerse, ...(m.alsoRead ?? []), ...m.thread.map((t) => t.ref)]);
  if (m.game.type === "builder") refs.add(m.game.ref ?? m.keyVerse);
  if (m.game.type === "armor") armorRefs().forEach((r) => refs.add(r));
  return Array.from(refs);
};

export const hrefFor = (m: Milestone) => `/journey/${m.stage}/${m.slug}`;
