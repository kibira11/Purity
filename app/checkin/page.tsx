import type { Metadata } from "next";
import { versesFor } from "@/lib/verses";
import { CheckinView } from "@/components/CheckinView";

export const metadata: Metadata = {
  title: "The Lamp",
  description: "A daily, honest check-in for mind, sexual purity, and substances. Met with grace, never shame.",
};

export default function CheckinPage() {
  const verses = versesFor(["Psalm 119:105", "Lamentations 3:22-23", "Proverbs 24:16"]);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">The Lamp</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">A light for the next step</h1>
      <p className="mt-3 max-w-xl text-night/75">
        &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo; (Psalm 119:105) A lamp does not show the whole
        road. It shows the next step. Check in every day, honestly. Falls are met with grace here, never shame.
      </p>
      <div className="mt-10">
        <CheckinView verses={verses} />
      </div>
    </div>
  );
}
