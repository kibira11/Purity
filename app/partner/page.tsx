import type { Metadata } from "next";
import { stages } from "@/content/stages";
import { allSteps } from "@/content";
import { PartnerView } from "@/components/PartnerView";

export const metadata: Metadata = {
  title: "Together",
  description: "Pair up with your friend: shared progress, encouragement, and prayer. Journals stay private.",
};

export default function PartnerPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow">Together</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Nobody crosses alone</h1>
      <p className="mt-3 max-w-xl text-night/75">
        Pair with your friend to see each other&rsquo;s progress, send encouragement, and share prayer needs.
        Personal journal entries stay private unless you choose to share one.
      </p>
      <div className="mt-10">
        <PartnerView stages={stages} steps={allSteps} />
      </div>
    </div>
  );
}
