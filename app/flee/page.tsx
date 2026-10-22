import type { Metadata } from "next";
import { versesFor } from "@/lib/verses";
import { FleeView } from "@/components/FleeView";

export const metadata: Metadata = {
  title: "Flee",
  description: "Tempted right now? Six steps to take, one at a time.",
};

const REFS = [
  "1 Corinthians 10:13",
  "James 4:7",
  "Psalm 46:1",
  "Isaiah 41:10",
  "Romans 8:1",
  "Matthew 26:41",
  "Psalm 121:1-2",
  "2 Timothy 2:22",
  "Hebrews 4:15-16",
];

export default function Flee() {
  return <FleeView verses={versesFor(REFS)} verseRefs={REFS} />;
}
