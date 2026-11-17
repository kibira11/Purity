"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { IconArrow, IconBack } from "../Icons";

export type BookPage = {
  id: string;
  title: string;
  eyebrow?: string;
  content: ReactNode;
  /** Optional left-page flavor on lg spread */
  aside?: ReactNode;
};

export type BookHandle = {
  goToPageId: (pageId: string) => void;
  goToIndex: (index: number) => void;
};

export type BookProps = {
  bookId: string;
  pages: BookPage[];
  cover?: ReactNode;
  backCover?: ReactNode;
  initialPageId?: string;
  onPageChange?: (pageId: string, index: number) => void;
  /** Pulse hint on turn affordance */
  nudgeTurn?: boolean;
  className?: string;
};

const SWIPE_VELOCITY = 400;
const SWIPE_OFFSET = 80;

function pageStorageKey(bookId: string) {
  return `purity:book:${bookId}`;
}

export const Book = forwardRef<BookHandle, BookProps>(function Book(
  {
    bookId,
    pages,
    cover,
    backCover,
    initialPageId,
    onPageChange,
    nudgeTurn,
    className = "",
  },
  ref,
) {
  const reduce = useReducedMotion();
  const liveId = useId();
  const [contentsOpen, setContentsOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const resolveIndex = useCallback(
    (id?: string | null) => {
      if (!id) return 0;
      const i = pages.findIndex((p) => p.id === id);
      return i >= 0 ? i : 0;
    },
    [pages],
  );

  const hashId = () => {
    if (typeof window === "undefined") return null;
    const h = window.location.hash.replace(/^#/, "");
    return h || null;
  };

  const [index, setIndex] = useState(0);
  const [showCover, setShowCover] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const [flipping, setFlipping] = useState<"fwd" | "back" | null>(null);

  // Hydrate index from hash, initialPageId, or localStorage
  useEffect(() => {
    const fromHash = hashId();
    const stored = (() => {
      try {
        return localStorage.getItem(pageStorageKey(bookId));
      } catch {
        return null;
      }
    })();
    const id = fromHash ?? initialPageId ?? stored;
    if (id === "__cover__") {
      setShowCover(true);
      setShowBack(false);
      setIndex(0);
      return;
    }
    if (id === "__back__") {
      setShowCover(false);
      setShowBack(true);
      setIndex(pages.length - 1);
      return;
    }
    const i = resolveIndex(id);
    setShowCover(!id && !!cover);
    setShowBack(false);
    setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, pages.length]);

  const syncLocation = useCallback(
    (opts: { cover?: boolean; back?: boolean; pageId?: string }) => {
      if (typeof window === "undefined") return;
      let hash = "";
      if (opts.cover) hash = "__cover__";
      else if (opts.back) hash = "__back__";
      else if (opts.pageId) hash = opts.pageId;
      const path = `${window.location.pathname}${window.location.search}`;
      const next = hash ? `${path}#${hash}` : path;
      if (`${window.location.pathname}${window.location.search}${window.location.hash ? window.location.hash : ""}` !== next) {
        window.history.replaceState(null, "", next);
      }
      try {
        if (hash) localStorage.setItem(pageStorageKey(bookId), hash);
      } catch {
        /* ignore */
      }
    },
    [bookId],
  );

  const goCover = useCallback(() => {
    setShowCover(true);
    setShowBack(false);
    syncLocation({ cover: true });
    onPageChange?.("__cover__", -1);
  }, [onPageChange, syncLocation]);

  const goBackCover = useCallback(() => {
    setShowCover(false);
    setShowBack(true);
    syncLocation({ back: true });
    onPageChange?.("__back__", pages.length);
  }, [onPageChange, pages.length, syncLocation]);

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(pages.length - 1, i));
      setShowCover(false);
      setShowBack(false);
      setIndex(clamped);
      const id = pages[clamped]?.id ?? "";
      syncLocation({ pageId: id });
      onPageChange?.(id, clamped);
    },
    [onPageChange, pages, syncLocation],
  );

  const goToPageId = useCallback(
    (pageId: string) => {
      if (pageId === "__cover__") {
        goCover();
        return;
      }
      if (pageId === "__back__") {
        goBackCover();
        return;
      }
      const i = pages.findIndex((p) => p.id === pageId);
      if (i >= 0) goTo(i);
    },
    [goBackCover, goCover, goTo, pages],
  );

  useImperativeHandle(ref, () => ({ goToPageId, goToIndex: goTo }), [goTo, goToPageId]);

  const next = useCallback(() => {
    if (showCover && pages.length) {
      goTo(0);
      return;
    }
    if (showBack) return;
    if (index < pages.length - 1) goTo(index + 1);
    else if (backCover) goBackCover();
  }, [backCover, goBackCover, goTo, index, pages.length, showBack, showCover]);

  const prev = useCallback(() => {
    if (showBack) {
      goTo(pages.length - 1);
      return;
    }
    if (index > 0) goTo(index - 1);
    else if (cover) goCover();
  }, [cover, goCover, goTo, index, pages.length, showBack]);

  const turn = (dir: "fwd" | "back") => {
    if (reduce) {
      if (dir === "fwd") next();
      else prev();
      return;
    }
    setFlipping(dir);
    window.setTimeout(() => {
      if (dir === "fwd") next();
      else prev();
      setFlipping(null);
    }, 420);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (contentsOpen) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        turn("fwd");
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        turn("back");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [contentsOpen, index, showBack, showCover]);

  useEffect(() => {
    if (!showCover && !showBack && headingRef.current) {
      headingRef.current.focus({ preventScroll: true });
    }
  }, [index, showBack, showCover]);

  const progress = showCover ? 0 : showBack ? 1 : (index + 1) / pages.length;
  const pageLabel = showCover
    ? "Cover"
    : showBack
      ? "End"
      : `Page ${index + 1} of ${pages.length}`;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) turn("fwd");
    else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) turn("back");
  };

  const current = !showCover && !showBack ? pages[index] : null;

  return (
    <div className={`book-shell mx-auto max-w-3xl ${className}`}>
      <ul className="book-dots mt-4 flex flex-wrap justify-center gap-1.5" aria-hidden>
        {cover && (
          <li
            className={`h-1.5 w-1.5 rounded-full transition-colors ${showCover ? "bg-dawn-deep" : "bg-night/15"}`}
          />
        )}
        {pages.map((p, i) => (
          <li
            key={p.id}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              !showCover && !showBack && i === index ? "bg-dawn-deep" : "bg-night/15"
            }`}
          />
        ))}
        {backCover && (
          <li className={`h-1.5 w-1.5 rounded-full transition-colors ${showBack ? "bg-dawn-deep" : "bg-night/15"}`} />
        )}
      </ul>

      <p className="sr-only" aria-live="polite" id={liveId}>
        {pageLabel}
        {current ? `: ${current.title}` : ""}
      </p>

      <div className="book-ribbon" style={{ top: `${8 + progress * 72}%` }} aria-hidden />

      <motion.div
        className="book-frame gilt-edge page-paper relative mt-3 min-h-[min(72vh,42rem)] overflow-hidden"
        drag={reduce ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
      >
        <motion.div
          className="book-edge-stack pointer-events-none absolute inset-y-6 right-0 w-3"
          style={{ opacity: 0.35 + progress * 0.4 }}
          aria-hidden
        />

        <button
          type="button"
          className="book-hitzone book-hitzone-left"
          aria-label="Previous page"
          onClick={() => turn("back")}
        />
        <button
          type="button"
          className={`book-hitzone book-hitzone-right ${nudgeTurn ? "book-nudge" : ""}`}
          aria-label="Next page"
          onClick={() => turn("fwd")}
        />

        <AnimatePresence mode="wait">
          {showCover && cover ? (
            <motion.div
              key="cover"
              className="book-page-inner flex min-h-[min(72vh,42rem)] flex-col px-6 py-10 sm:px-12"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45 }}
            >
              {cover}
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.2, duration: 0.6 }}
                className="mt-8 text-center"
              >
                <button type="button" className="btn btn-gold" onClick={() => turn("fwd")}>
                  Open the book <IconArrow width={18} height={18} />
                </button>
              </motion.div>
            </motion.div>
          ) : showBack && backCover ? (
            <motion.div
              key="back"
              className="book-page-inner flex min-h-[min(72vh,42rem)] flex-col px-6 py-10 sm:px-12"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
            >
              {backCover}
            </motion.div>
          ) : current ? (
            <motion.div
              key={current.id}
              className="book-page-inner grid min-h-[min(72vh,42rem)] lg:grid-cols-[minmax(0,0.38fr)_minmax(0,1fr)]"
              initial={
                reduce || !flipping
                  ? { opacity: flipping === "fwd" ? 0.6 : 1 }
                  : {
                      opacity: 1,
                      rotateY: flipping === "fwd" ? 0 : -8,
                      transformPerspective: 1200,
                    }
              }
              animate={
                reduce
                  ? { opacity: 1, rotateY: 0 }
                  : flipping === "fwd"
                    ? { rotateY: -88, opacity: 0.92 }
                    : flipping === "back"
                      ? { rotateY: 12, opacity: 0.95 }
                      : { rotateY: 0, opacity: 1 }
              }
              transition={{ duration: reduce ? 0.15 : 0.42, ease: [0.22, 0.61, 0.36, 1] }}
              style={{ transformOrigin: "left center" }}
            >
              <aside className="book-spread-left hidden border-r border-night/10 bg-linen-deep/50 px-8 py-10 lg:flex lg:flex-col lg:justify-center">
                <p className="eyebrow">{current.eyebrow ?? "In this step"}</p>
                <h2 className="mt-3 text-3xl">{current.title}</h2>
                <p className="mt-4 font-display text-4xl text-dawn-deep/80">{String(index + 1).padStart(2, "0")}</p>
                {current.aside}
              </aside>
              <article className="flex flex-col overflow-y-auto px-6 py-8 sm:px-10 lg:max-h-[min(72vh,42rem)]">
                <p className="eyebrow lg:hidden">{current.eyebrow ?? "In this step"}</p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-2 text-[1.85rem] focus:outline-none sm:text-[2.2rem] lg:mt-0"
                >
                  {current.title}
                </h2>
                <div className="book-page-body mt-5 flex-1">{current.content}</div>
              </article>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <button type="button" className="btn btn-ghost !min-h-0 !py-2" onClick={() => turn("back")} disabled={showCover && !cover}>
            <IconBack width={16} height={16} /> Previous
          </button>
          <button
            type="button"
            className="btn btn-ghost !min-h-0 !py-2"
            onClick={() => turn("fwd")}
            disabled={showBack}
          >
            Next <IconArrow width={16} height={16} />
          </button>
        </div>
        <p className="w-full text-center text-sm font-semibold text-night/70">{pageLabel}</p>
      </div>

      <button
        type="button"
        className="mt-3 w-full text-center text-sm font-semibold text-gold-ink underline decoration-dawn decoration-2 underline-offset-4"
        onClick={() => setContentsOpen((o) => !o)}
        aria-expanded={contentsOpen}
      >
        Contents
      </button>

      {contentsOpen && (
        <nav aria-label="Book contents" className="paper mt-3 max-h-64 overflow-y-auto px-4 py-3">
          <ul className="space-y-1">
            {cover && (
              <li>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-night/5"
                  onClick={() => {
                    goCover();
                    setContentsOpen(false);
                  }}
                >
                  Cover
                </button>
              </li>
            )}
            {pages.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-night/5 ${
                    i === index && !showCover && !showBack ? "bg-dawn/25" : ""
                  }`}
                  onClick={() => {
                    goTo(i);
                    setContentsOpen(false);
                  }}
                >
                  {i + 1}. {p.title}
                </button>
              </li>
            ))}
            {backCover && (
              <li>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-night/5"
                  onClick={() => {
                    goBackCover();
                    setContentsOpen(false);
                  }}
                >
                  Seal &amp; continue
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}

    </div>
  );
});