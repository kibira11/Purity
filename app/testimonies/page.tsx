import type { Metadata } from "next";
import { testimonies } from "@/content/testimonies";
import { versesFor } from "@/lib/verses";
import { TestimoniesView } from "@/components/TestimoniesView";

export const metadata: Metadata = {
  title: "Testimonies",
  description: "People who were set free, from Scripture, history and today, plus a place to write your own.",
};

export default function Testimonies() {
  const verses = versesFor(testimonies.flatMap((t) => (t.verse ? [t.verse] : [])));
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">You are not the first</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Testimonies</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        People who fought the same fight and were set free. These are short, careful summaries of stories that are
        already public, each with a link so you can read the whole thing.
      </p>
      <TestimoniesView testimonies={testimonies} verses={verses} />
    </div>
  );
}
