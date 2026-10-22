"use client";

import { useTranslation, type TranslationPick } from "@/lib/useTranslation";
import { translationShort } from "@/lib/credits";
import type { VerseData } from "@/lib/verses";

export function pickText(v: VerseData, pick: TranslationPick): { text: string; label: string } | null {
  if (pick === "MODERN" && v.modern) return { text: v.modern.text, label: v.modern.tr };
  if (pick === "KJV" && v.kjv) return { text: v.kjv, label: "KJV" };
  if (v.web) return { text: v.web, label: "WEB" };
  if (v.kjv) return { text: v.kjv, label: "KJV" };
  if (v.modern) return { text: v.modern.text, label: v.modern.tr };
  return null;
}

export function contextLink(ref: string) {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=WEB`;
}

export function Verse({
  data,
  size = "lg",
  dark = false,
  showTabs = true,
}: {
  data: VerseData;
  size?: "lg" | "sm";
  dark?: boolean;
  showTabs?: boolean;
}) {
  const [pick, setPick] = useTranslation();
  const shown = pickText(data, pick);
  const tabs: { id: TranslationPick; label: string; enabled: boolean }[] = [
    { id: "WEB", label: "WEB", enabled: !!data.web },
    { id: "KJV", label: "KJV", enabled: !!data.kjv },
    { id: "MODERN", label: data.modern?.tr ?? "Modern", enabled: !!data.modern },
  ];
  const active = shown?.label;

  return (
    <figure
      className={`relative rounded-2xl border-l-4 border-dawn ${
        dark ? "bg-white/5 text-linen" : "bg-white/70"
      } ${size === "lg" ? "px-5 py-5 sm:px-7 sm:py-6" : "px-4 py-3.5"}`}
    >
      {showTabs && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Translation">
          {tabs
            .filter((t) => t.enabled)
            .map((t) => {
              const on = active === t.label;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setPick(t.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider transition-colors duration-500 ${
                    on
                      ? "bg-night text-dawn-pale"
                      : dark
                        ? "text-linen/60 hover:text-linen"
                        : "text-night/70 hover:bg-night/5 hover:text-night"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
        </div>
      )}
      {shown ? (
        <blockquote
          className={`font-scripture ${size === "lg" ? "text-[1.18rem] leading-[1.85]" : "text-[1.02rem] leading-[1.75]"} ${
            dark ? "text-linen" : "text-night"
          }`}
        >
          {shown.text}
        </blockquote>
      ) : (
        <p className="font-scripture italic opacity-70">Text for this passage is being prepared.</p>
      )}
      <figcaption className={`mt-3 flex flex-wrap items-center gap-x-3 text-sm ${dark ? "text-dawn-pale" : "text-gold-ink"}`}>
        <cite className="font-semibold not-italic">{data.ref}</cite>
        {shown && (
          <span className={`text-xs ${dark ? "text-linen/55" : "text-night/70"}`}>
            {translationShort[shown.label] ?? shown.label}
          </span>
        )}
        <a
          href={contextLink(data.ref)}
          target="_blank"
          rel="noopener noreferrer"
          className={`ml-auto text-xs underline-offset-4 hover:underline ${dark ? "text-linen/60" : "text-night/70"}`}
        >
          Read in context
        </a>
      </figcaption>
    </figure>
  );
}
