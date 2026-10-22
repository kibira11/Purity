"use client";

import { useCallback, useSyncExternalStore } from "react";

export type TranslationPick = "WEB" | "KJV" | "MODERN";
const KEY = "purity:translation";
const EVENT = "purity:translation-change";

function read(): TranslationPick {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "WEB" || v === "KJV" || v === "MODERN") return v;
  } catch {
    /* ignore */
  }
  return "WEB";
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Remembers the reader's preferred translation across the whole app. */
export function useTranslation(): [TranslationPick, (t: TranslationPick) => void] {
  const pick = useSyncExternalStore(subscribe, read, () => "WEB" as TranslationPick);
  const set = useCallback((t: TranslationPick) => {
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return [pick, set];
}
