"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Artwork } from "@/lib/types";
import { Rich } from "./Rich";

export function GalleryView({
  works,
  stageNames,
}: {
  works: Artwork[];
  stageNames: Record<string, string>;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = works.find((w) => w.id === openId);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener.current?.focus();
    };
  }, [open]);

  return (
    <>
      <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        {works.map((w) => (
          <li key={w.id} className="break-inside-avoid">
            <button
              className="group block w-full overflow-hidden rounded-2xl border border-night/10 bg-night text-left shadow-[0_18px_40px_-24px_rgba(27,31,59,0.6)]"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpenId(w.id);
              }}
            >
              <Image
                src={`/art/${w.file}`}
                alt={`${w.title} by ${w.artist}`}
                width={900}
                height={700}
                className="h-auto w-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]"
              />
              <span className="block bg-night px-4 py-3">
                <span className="block font-display text-xl leading-tight text-dawn-pale">{w.title}</span>
                <span className="block text-sm text-linen/70">
                  {w.artist}, {w.date}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-night-deep/90 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpenId(null)}
        >
          <div
            className="relative flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-linen sm:rounded-3xl lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center bg-night-deep">
              <Image
                src={`/art/${open.file}`}
                alt={`${open.title} by ${open.artist}`}
                width={1600}
                height={1200}
                className="max-h-[50dvh] w-full object-contain lg:max-h-[88dvh]"
              />
            </div>
            <div className="max-h-[50dvh] overflow-y-auto px-6 py-6 lg:max-h-[88dvh] lg:w-[24rem] lg:shrink-0">
              <p className="eyebrow">{open.stage ? `${stageNames[open.stage] ?? open.stage}` : "Gallery"}</p>
              <h2 className="mt-1 text-3xl leading-tight">{open.title}</h2>
              <p className="mt-1 text-sm text-night/65">
                {open.artist}, {open.date}
              </p>
              <p className="mt-4 text-[1.02rem] text-night/85">
                <Rich text={open.story} />
              </p>
              <p className="mt-5 text-xs text-night/70">
                {open.license}.{" "}
                <a href={open.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  Source on Wikimedia Commons
                </a>
              </p>
              {open.stage && (
                <Link href={`/journey/${open.stage}`} className="mt-3 inline-block text-sm font-semibold underline decoration-dawn decoration-2 underline-offset-4">
                  See the stage it belongs to
                </Link>
              )}
            </div>
            <button
              ref={closeRef}
              onClick={() => setOpenId(null)}
              className="absolute right-3 top-3 rounded-full bg-night/80 px-3.5 py-1.5 text-sm font-semibold text-linen backdrop-blur hover:bg-night"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
