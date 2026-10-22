"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconLamp, IconMap, IconMore, IconPlay, IconTogether } from "./Icons";

const items = [
  { href: "/journey", label: "Journey", Icon: IconMap },
  { href: "/play", label: "Play", Icon: IconPlay },
  { href: "/checkin", label: "Lamp", Icon: IconLamp },
  { href: "/partner", label: "Together", Icon: IconTogether },
  { href: "/more", label: "More", Icon: IconMore },
];

export function BottomNav() {
  const path = usePathname();
  if (path === "/flee") return null;
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-night/10 bg-linen/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {items.map(({ href, label, Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-1 py-2.5 text-[0.7rem] font-semibold transition-colors duration-500 ${
                  active ? "text-night" : "text-night/70"
                }`}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors duration-500 ${
                    active ? "bg-dawn/45" : ""
                  }`}
                >
                  <Icon />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
