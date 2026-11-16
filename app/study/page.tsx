import type { Metadata } from "next";
import { studies } from "@/content/studies";
import { StudyIndex } from "@/components/StudyView";

export const metadata: Metadata = {
  title: "Bible studies",
  description: "Structured studies for solo reading or leading a small group.",
};

export default function StudyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Open, observe, apply</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Bible studies</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        Turn the pages at your own pace, or gather a group and walk the same sessions together online.
      </p>
      <StudyIndex
        items={studies.map((s) => ({
          id: s.id,
          title: s.title,
          blurb: s.blurb,
          sessions: s.sessions.length,
        }))}
      />
    </div>
  );
}