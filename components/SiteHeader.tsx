"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainLinks } from "@/lib/nav";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#c8903f" />
            <stop offset="1" stopColor="#f6dfb2" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill={light ? "rgba(247,241,230,0.08)" : "#1b1f3b"} />
        <path d="M4 23c4-3 7-3 12 0s8 3 12 0" stroke="url(#lg)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M16 5c2.600 3.200 4 5 4 7.500a4 4 0 0 1-8 0c0-2.500 1.400-4.300 4-7.500Z" fill="url(#lg)" />
      </svg>
      <span
        className={`font-display text-[1.45rem] font-semibold leading-none tracking-tight ${
          light ? "text-dawn-pale" : "text-night"
        }`}
      >
        Journey to Purity
      </span>
    </span>
  );
}

export function SiteHeader() {
  const path = usePathname();
  if (path === "/") return null; // the landing page has its own hero header
  return (
    <header className="sticky top-0 z-40 border-b border-night/10 bg-linen/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3">
        <Link href="/" aria-label="Journey to Purity, home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainLinks.slice(0, 7).map((l) => {
            const active = path === l.href || path.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-[0.92rem] font-medium transition-colors duration-500 ${
                  active ? "bg-night text-linen" : "text-night/75 hover:bg-night/5 hover:text-night"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/login" className="btn btn-ghost !min-h-0 !px-4 !py-1.5 text-sm max-lg:hidden">
          Account
        </Link>
      </div>
    </header>
  );
}
