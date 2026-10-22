import type { Metadata } from "next";
import { stages } from "@/content/stages";
import { allSteps } from "@/content";
import { versesFor } from "@/lib/verses";
import { StonesView } from "@/components/StonesView";

export const metadata: Metadata = {
  title: "Stones of Remembrance",
  description: "A stone for every stage you have crossed.",
};

export default function Stones() {
  return <StonesView stages={stages} steps={allSteps} verses={versesFor(["Joshua 4:6-7"])} />;
}
