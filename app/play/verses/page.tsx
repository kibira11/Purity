import Link from "next/link";
import type { Metadata } from "next";
import { allMilestones } from "@/content";
import { stages } from "@/content/stages";
import { versesFor } from "@/lib/verses";
import { PlayVerses, type PlayVerseOption } from "@/components/PlayArena";
import { IconBack } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Verse Builder",
  description: "Rebuild key verses word by word to carry them in your heart.",
};

const words = (s?: string) => (s ? s.split(/\s+/).filter(Boolean).length : 0);

export default function VersesPage() {
  const refs = Array.from(
    new Set(allMilestones.map((m) => (m.game.type === "builder" ? (m.game.ref ?? m.keyVerse) : m.keyVerse))),
  );
  const verses = versesFor(refs);
  const options: PlayVerseOption[] = [];
  for (const m of allMilestones) {
    const ref = m.game.type === "builder" ? (m.game.ref ?? m.keyVerse) : m.keyVerse;
    const v = verses[ref];
    const n = words(v?.web ?? v?.kjv);
    if (n >= 6 && n <= 60 && !options.some((o) => o.ref === ref)) options.push({ ref, stage: m.stage });
  }
  const used = Object.fromEntries(options.map((o) => [o.ref, verses[o.ref]]));
  const stageNames = Object.fromEntries(stages.map((s) => [s.id, s.name]));
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/play" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> Play
      </Link>
      <p className="eyebrow mt-6">Memorize</p>
      <h1 className="mt-2 text-5xl">Verse Builder</h1>
      <p className="mt-3 max-w-xl text-night/75">
        &ldquo;Thy word have I hid in mine heart, that I might not sin against thee.&rdquo; Rebuild a verse from its
        pieces, and it begins to live in you.
      </p>
      <div className="mt-8">
        <PlayVerses options={options} verses={used} stageNames={stageNames} />
      </div>
    </div>
  );
}
