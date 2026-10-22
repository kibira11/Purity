import type { Metadata } from "next";
import { questions } from "@/content/questions";
import { allMilestones } from "@/content";
import { versesFor } from "@/lib/verses";
import { QuestionsView } from "@/components/QuestionsView";

export const metadata: Metadata = {
  title: "Questions Library",
  description: "Straight answers from Scripture to the questions young people actually ask about purity, relationships, alcohol and falling.",
};

export default function Questions() {
  const verses = versesFor(questions.flatMap((q) => q.verses));
  const titles = Object.fromEntries(allMilestones.map((m) => [`${m.stage}/${m.slug}`, m.title]));
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow">Straight answers</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Questions Library</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        The questions you are probably afraid to ask out loud. Each answer draws on Scripture, and links to the steps of
        the journey that go deeper.
      </p>
      <QuestionsView questions={questions} verses={verses} titles={titles} />
    </div>
  );
}
