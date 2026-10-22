import Link from "next/link";
import type { Metadata } from "next";
import { moreLinks } from "@/lib/nav";
import { IconArrow } from "@/components/Icons";

export const metadata: Metadata = { title: "More" };

export default function More() {
  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <p className="eyebrow">Everything else</p>
      <h1 className="mt-2 text-5xl">More</h1>
      <ul className="mt-8 space-y-3">
        {moreLinks.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="paper flex items-center justify-between gap-4 px-5 py-4">
              <span>
                <span className="block font-display text-2xl leading-tight">{l.label}</span>
                <span className="text-sm text-night/65">{l.note}</span>
              </span>
              <IconArrow className="shrink-0 text-night/70" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
