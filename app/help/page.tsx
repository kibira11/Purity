import type { Metadata } from "next";
import { help } from "@/content/help";
import { IconArrow } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Help and professional care",
  description: "Where to find real people and real care: crisis support, safe withdrawal, recovery groups and counselors.",
};

const tone = {
  urgent: "border-clay bg-clay/10",
  warning: "border-dawn-deep bg-dawn/20",
  plain: "border-night/10 bg-white/60",
} as const;

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">You are not meant to do this alone</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Help</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        This app is a companion for your walk. It is not a replacement for a doctor, a counselor, a pastor or a friend
        who can sit in the room with you. Asking for that kind of help is wisdom, not weakness.
      </p>

      <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
        {help.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="chip">
            {s.title.split(":")[0]}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-6">
        {help.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-28 rounded-2xl border px-5 py-6 sm:px-7 ${tone[s.tone ?? "plain"]}`}
          >
            <h2 className="text-3xl">{s.title}</h2>
            {s.intro && <p className="mt-3 text-[1.05rem] text-night/85">{s.intro}</p>}
            {s.points && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-night/80">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            <ul className="mt-4 space-y-3">
              {s.links.map((l) => (
                <li key={l.url + l.name}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3 rounded-xl bg-white/70 px-4 py-3 transition-colors duration-500 hover:bg-white"
                  >
                    <span>
                      <span className="block font-semibold text-night">{l.name}</span>
                      <span className="block text-sm text-night/70">{l.note}</span>
                    </span>
                    <IconArrow className="mt-1 shrink-0 text-night/70 transition-transform duration-500 group-hover:translate-x-1" width={18} height={18} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-night/70">
        These links open outside this app. We do not control them, and we check them from time to time. If one has moved,
        a search for the organization&rsquo;s name will find it.
      </p>
    </div>
  );
}
