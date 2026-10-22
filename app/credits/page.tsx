import type { Metadata } from "next";
import { artworks } from "@/content/art";
import { allMilestones } from "@/content";
import { translations, tools } from "@/lib/credits";

export const metadata: Metadata = {
  title: "Credits and sources",
  description: "Where the Scripture, the art and the science in this app come from.",
};

function scienceSources() {
  const seen = new Map<string, { source: string; url?: string; used: string[] }>();
  for (const m of allMilestones) {
    const key = m.mind.sourceUrl ?? m.mind.source;
    const entry = seen.get(key) ?? { source: m.mind.source, url: m.mind.sourceUrl, used: [] };
    entry.used.push(m.title);
    seen.set(key, entry);
  }
  return [...seen.values()];
}

export default function Credits() {
  const science = scienceSources();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">With thanks</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Credits and sources</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        Nothing here is invented from nowhere. This page names where each piece came from so you can check it for yourself.
      </p>

      <section className="mt-12" aria-labelledby="scripture">
        <h2 id="scripture" className="text-3xl">Scripture</h2>
        <ul className="mt-4 space-y-3">
          {translations.map((t) => (
            <li key={t.code} className="rounded-xl border border-night/10 bg-white/60 px-4 py-3">
              <p className="font-semibold text-night">
                {t.code} <span className="font-normal text-night/70">&middot; {t.name}</span>
              </p>
              <p className="mt-1 text-sm text-night/70">{t.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="art">
        <h2 id="art" className="text-3xl">Art</h2>
        <p className="mt-2 text-night/75">
          Images are public domain unless a license is named. Click through to the original record at Wikimedia Commons.
        </p>
        <ul className="mt-4 space-y-3">
          {artworks.map((a) => (
            <li key={a.id} className="rounded-xl border border-night/10 bg-white/60 px-4 py-3 text-sm">
              <p className="font-semibold text-night">
                {a.title} <span className="font-normal text-night/70">&middot; {a.artist}, {a.date}</span>
              </p>
              <p className="mt-1 text-night/70">
                {a.license}
                {" \u00b7 "}
                <a href={a.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                  Source
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="science">
        <h2 id="science" className="text-3xl">Science and the body</h2>
        <p className="mt-2 text-night/75">
          The &ldquo;Mind&rdquo; and &ldquo;Body&rdquo; sections cite published research and health bodies. We summarize and
          try not to overstate. Read the originals, and talk to a doctor about your own situation.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {science.map((s) => (
            <li key={s.url ?? s.source} className="rounded-xl border border-night/10 bg-white/60 px-4 py-3">
              {s.url ? (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-night underline underline-offset-2">
                  {s.source}
                </a>
              ) : (
                <span className="font-semibold text-night">{s.source}</span>
              )}
              <span className="mt-0.5 block text-night/70">Used in: {s.used.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="built">
        <h2 id="built" className="text-3xl">Built with</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {tools.map((t) => (
            <li key={t.name}>
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-night underline underline-offset-2">
                {t.name}
              </a>
              <span className="text-night/70"> &mdash; {t.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
