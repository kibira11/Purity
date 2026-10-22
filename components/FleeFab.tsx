"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconWing } from "./Icons";

/** Always one tap away. */
export function FleeFab() {
  const path = usePathname();
  if (path === "/flee") return null;
  return (
    <nav aria-label="Emergency help">
      <Link
        href="/flee"
        aria-label="Flee: I need help right now"
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-b from-clay to-clay-deep px-4 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(163,95,73,0.9)] transition-transform duration-500 hover:-translate-y-0.5 lg:bottom-6 lg:right-6"
      >
        <IconWing />
        <span>Flee</span>
      </Link>
    </nav>
  );
}
