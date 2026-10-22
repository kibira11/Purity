import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allMilestones, allSteps, getMilestone, refsForMilestone } from "@/content";
import { stageById } from "@/content/stages";
import { artById } from "@/content/art";
import { scenarios, scenarioRefs } from "@/content/crossroads";
import { versesFor } from "@/lib/verses";
import { MilestoneView } from "@/components/MilestoneView";

type Params = { stage: string; slug: string };

export function generateStaticParams(): Params[] {
  return allMilestones.map((m) => ({ stage: m.stage, slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { stage, slug } = await params;
  const m = getMilestone(stage, slug);
  if (!m) return {};
  return { title: m.title, description: m.tagline };
}

export default async function MilestonePage({ params }: { params: Promise<Params> }) {
  const { stage, slug } = await params;
  const m = getMilestone(stage, slug);
  const st = stageById(stage);
  if (!m || !st) notFound();

  const stageSteps = allSteps.filter((s) => s.stage === st.id);
  const scenario = m.game.type === "crossroads" ? scenarios[m.game.scenario] : undefined;
  const refs = [...refsForMilestone(m), ...(scenario ? scenarioRefs().filter((r) => scenario.nodes.some((n) => n.ending?.verse === r)) : [])];

  return (
    <MilestoneView
      m={m}
      stage={{ id: st.id, name: st.name, number: st.number, subtitle: st.subtitle, storyRef: st.storyRef }}
      position={{ index: stageSteps.findIndex((s) => s.id === m.id) + 1, total: stageSteps.length }}
      verses={versesFor(refs)}
      steps={allSteps}
      scenario={scenario}
      art={m.art ? (artById(m.art) ?? null) : null}
    />
  );
}
