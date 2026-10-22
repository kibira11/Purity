import Link from "next/link";
import type { Metadata } from "next";
import { scenarioList, scenarioRefs } from "@/content/crossroads";
import { stages } from "@/content/stages";
import { versesFor } from "@/lib/verses";
import { PlayCrossroads } from "@/components/PlayArena";
import { IconBack } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Crossroads",
  description: "Choose-your-path rehearsals for the real moments that decide things.",
};

export default function CrossroadsPage() {
  const list = scenarioList();
  const stageNames = Object.fromEntries(stages.map((s) => [s.id, s.name]));
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/play" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> Play
      </Link>
      <p className="eyebrow mt-6">Rehearse</p>
      <h1 className="mt-2 text-5xl">Crossroads</h1>
      <p className="mt-3 max-w-xl text-night/75">
        The best time to decide what you will do is before you are standing in the room. Pick a scene and walk it,
        then walk the other road too.
      </p>
      <div className="mt-8">
        <PlayCrossroads scenarios={list} verses={versesFor(scenarioRefs())} stageNames={stageNames} />
      </div>
    </div>
  );
}
