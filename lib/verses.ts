import raw from "@/content/verses.json";
import { modern } from "@/content/modern";
import type { TranslationId } from "./types";

export interface VerseData {
  ref: string;
  kjv?: string;
  web?: string;
  modern?: { tr: Exclude<TranslationId, "KJV" | "WEB">; text: string };
}

const store = raw as Record<string, { kjv?: string; web?: string }>;

/** Server-side: resolve only the verses a page needs, so the client bundle stays small. */
export function versesFor(refs: Iterable<string>): Record<string, VerseData> {
  const out: Record<string, VerseData> = {};
  for (const ref of refs) {
    out[ref] = { ref, ...store[ref], modern: modern[ref] };
  }
  return out;
}

export function verseCount() {
  return Object.keys(store).length;
}
