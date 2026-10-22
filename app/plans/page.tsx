import type { Metadata } from "next";
import { plans } from "@/content/plans";
import { PlansIndex } from "@/components/PlansView";

export const metadata: Metadata = {
  title: "Bible study plans",
  description: "Short reading plans for the road: grace, flight, renewal and the Psalms of ascent.",
};

export default function Plans() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Read together</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Study plans</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        One short passage a day. Tick it off, and if you have paired with a friend you will see each other&rsquo;s
        progress. Missing a day is not a failure: pick up where you stopped.
      </p>
      <PlansIndex plans={plans.map((p) => ({ id: p.id, title: p.title, blurb: p.blurb, total: p.days.length }))} />
    </div>
  );
}
