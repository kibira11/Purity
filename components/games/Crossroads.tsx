"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Scenario } from "@/content/crossroads";
import type { VerseData } from "@/lib/verses";
import { Verse } from "../Verse";
import { Rich } from "../Rich";

/**
 * A choose-your-path scene. Wise endings win the game. Falls are never a dead end:
 * they show what happened, offer mercy, and let you walk the road again.
 */
export function CrossroadsGame({
  scenario,
  verses,
  onWin,
  compact = false,
}: {
  scenario: Scenario;
  verses: Record<string, VerseData>;
  onWin: () => void;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const [nodeId, setNodeId] = useState(scenario.start);
  const [trail, setTrail] = useState<string[]>([]);
  const [wins, setWins] = useState(0);
  const node = scenario.nodes.find((n) => n.id === nodeId)!;
  const fired = useRef(false);

  useEffect(() => {
    if (node.ending?.kind === "wise" && !fired.current) {
      fired.current = true;
      setWins((w) => w + 1);
      onWin();
    }
  }, [node, onWin]);

  const go = (to: string) => {
    setTrail((t) => [...t, nodeId]);
    setNodeId(to);
  };
  const restart = () => {
    setNodeId(scenario.start);
    setTrail([]);
  };
  const back = () => {
    setNodeId(trail[trail.length - 1] ?? scenario.start);
    setTrail((t) => t.slice(0, -1));
  };

  return (
    <div>
      {!compact && (
        <p className="text-sm text-linen/75">
          This is not a quiz. It is a rehearsal. Decide now, with a clear head, what you will do when it is real.
        </p>
      )}
      <div className="mt-4 rounded-2xl border border-dawn/25 bg-night-deep/60 p-5 sm:p-6">
        <p className="eyebrow !text-dawn">{scenario.title}</p>
        <p className="mt-2 text-[0.95rem] italic text-linen/70">{scenario.setup}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className="mt-5"
          >
            {node.text && (
              <p className="font-scripture text-[1.12rem] leading-[1.8] text-linen">
                <Rich text={node.text} />
              </p>
            )}

            {node.choices && (
              <div className="mt-5 grid gap-2.5">
                {node.choices.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => go(c.to)}
                    className="rounded-xl border border-linen/25 bg-white/10 px-4 py-3 text-left text-linen transition-colors duration-500 hover:border-dawn/70 hover:bg-white/15"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {node.ending && (
              <div
                className={`mt-5 rounded-2xl p-5 ${
                  node.ending.kind === "wise" ? "bg-olive/25" : "bg-clay/20"
                }`}
              >
                <p className="font-display text-3xl text-dawn-pale">{node.ending.title}</p>
                <p className="mt-2 text-[1rem] text-linen/90">
                  <Rich text={node.ending.text} />
                </p>
                {verses[node.ending.verse] && (
                  <div className="mt-4">
                    <Verse data={verses[node.ending.verse]} size="sm" dark showTabs={false} />
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="btn btn-gold !min-h-0 !py-2" onClick={restart}>
                    {node.ending.kind === "wise" ? "Walk it again" : "Rewind to the crossroads"}
                  </button>
                  {trail.length > 0 && node.ending.kind === "fall" && (
                    <button className="btn btn-ghost-light !min-h-0 !py-2" onClick={back}>
                      Take one step back
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {wins > 0 && <p className="mt-3 text-sm text-dawn-pale">You have found the wise road. Remember it.</p>}
    </div>
  );
}
