import type { Metadata } from "next";
import { allSteps } from "@/content";
import { JournalView } from "@/components/JournalView";

export const metadata: Metadata = {
  title: "My journal",
  description: "Your private journal. Reflections from each step are saved here.",
};

export default function JournalPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="eyebrow">Journal</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Write it down</h1>
      <p className="mt-3 max-w-xl text-night/75">
        Private by default. Even if you sign in, the database will not let your friend read an entry unless you choose to
        share it.
      </p>
      <div className="mt-10">
        <JournalView steps={allSteps} />
      </div>
    </div>
  );
}
