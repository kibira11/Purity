"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GoldDust({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  if (!active || reduce) return null;
  const dots = Array.from({ length: 18 }, (_, i) => i);
  return (
    <p className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex justify-center gap-1" aria-hidden>
      {dots.map((i) => (
        <motion.span
          key={i}
          className="h-1 w-1 rounded-full bg-dawn"
          initial={{ opacity: 0.9, y: 0, x: (i % 5) * 4 - 8 }}
          animate={{ opacity: 0, y: -40 - (i % 7) * 6 }}
          transition={{ duration: 1.2 + (i % 4) * 0.15, ease: "easeOut" }}
        />
      ))}
    </p>
  );
}