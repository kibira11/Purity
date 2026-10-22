import Link from "next/link";
import type { Metadata } from "next";
import { IconArrow } from "@/components/Icons";
import { scenarioList } from "@/content/crossroads";
import { armor } from "@/content/armor";
import { Reveal } from "@/components/Section";

export const metadata: Metadata = {
  title: "Play",
  description: "Practice what you are learning: build verses, match the golden thread, walk real-life crossroads, and put on the armor of God.",
};

const games = [
  {
    href: "/play/crossroads",
    title: "Crossroads",
    blurb: "Real moments, real choices. Rehearse what you will do before it is real. Falls are never a dead end.",
    count: `${scenarioList().length} scenes`,
  },
  {
    href: "/play/armor",
    title: "Armor of God",
    blurb: "Seven moments, seven pieces. Learn which part of Ephesians 6 to reach for when.",
    count: `${armor.length} pieces`,
  },
  {
    href: "/play/verses",
    title: "Verse Builder",
    blurb: "Put a verse back together word by word. The surest way to carry it in your heart.",
    count: "Memorize",
  },
  {
    href: "/play/threads",
    title: "Golden Thread",
    blurb: "Match each passage to how it explains the key verse. Scripture explains Scripture.",
    count: "Every step",
  },
];

export default function Play() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Practice</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Play</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        Every step of the journey ends with a game, and winning it seals the step. Here you can replay any of them
        whenever you like: no locks, no scores, just practice.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {games.map((g, i) => (
          <Reveal key={g.href} delay={i * 0.06}>
            <Link href={g.href} className="night-panel stars group block h-full px-6 py-7">
              <p className="eyebrow !text-dawn">{g.count}</p>
              <p className="mt-2 font-display text-4xl text-dawn-pale">{g.title}</p>
              <p className="mt-2 text-linen/80">{g.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-dawn">
                Play <IconArrow width={16} height={16} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
