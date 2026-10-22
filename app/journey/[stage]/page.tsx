import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { stages, stageById } from "@/content/stages";
import { allSteps } from "@/content";
import { versesFor } from "@/lib/verses";
import { StageView } from "@/components/StageView";

type Params = { stage: string };

export function generateStaticParams(): Params[] {
  return stages.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { stage } = await params;
  const st = stageById(stage);
  return st ? { title: `${st.name}: ${st.subtitle}`, description: st.blurb } : {};
}

export default async function StagePage({ params }: { params: Promise<Params> }) {
  const { stage } = await params;
  const st = stageById(stage);
  if (!st) notFound();
  const i = stages.findIndex((s) => s.id === st.id);
  return (
    <StageView
      stage={st}
      steps={allSteps.filter((s) => s.stage === st.id)}
      allSteps={allSteps}
      storyVerse={versesFor([st.storyRef])[st.storyRef]}
      prevStage={i > 0 ? stages[i - 1] : null}
      nextStage={i < stages.length - 1 ? stages[i + 1] : null}
    />
  );
}
