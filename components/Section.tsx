"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  tone = "plain",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  tone?: "plain" | "paper" | "night";
  children: React.ReactNode;
}) {
  const wrapper =
    tone === "night"
      ? "night-panel stars px-6 py-8 sm:px-10 sm:py-10"
      : tone === "paper"
        ? "paper px-6 py-8 sm:px-10 sm:py-10"
        : "";
  return (
    <section id={id} className="scroll-mt-32">
      <Reveal className={wrapper}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-[2rem] sm:text-[2.4rem]">{title}</h2>
        <div className="mt-5">{children}</div>
      </Reveal>
    </section>
  );
}
