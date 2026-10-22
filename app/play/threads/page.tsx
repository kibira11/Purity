import Link from "next/link";
import type { Metadata } from "next";
import { allMilestones, refsForMilestone } from "@/content";
import { stages } from "@/content/stages";
import { versesFor } from "@/lib/verses";
import { PlayThreads, type PlayThreadStep } from "@/components/PlayArena";
import { IconBack } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Golden Thread",
  description: "Match each passage to the way it explains the key verse.",
};

export default function ThreadsPage() {
  const steps: PlayThreadStep[] = allMilestones.map((m) => {
    const verses = versesFor(refsForMilestone(m));
    return {
      id: m.id,
      title: m.title,
      stage: m.stage,
      keyRef: m.keyVerse,
      pairs: m.thread.map((t) => ({ ref: t.ref, note: t.note, verse: verses[t.ref] })),
    };
  });
  const stageNames = Object.fromEntries(stages.map((s) => [s.id, s.name]));
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/play" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> Play
      </Link>
      <p className="eyebrow mt-6">Scripture explains Scripture</p>
      <h1 className="mt-2 text-5xl">Golden Thread</h1>
      <p className="mt-3 max-w-xl text-night/75">
        Every step pulls one thread through the whole Bible. Pick a step and match each passage to what it adds.
      </p>
      <div className="mt-8">
        <PlayThreads steps={steps} stageNames={stageNames} />
      </div>
    </div>
  );
}
