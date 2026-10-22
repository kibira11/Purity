import type { Metadata } from "next";
import { stages } from "@/content/stages";
import { allSteps } from "@/content";
import { JourneyMap } from "@/components/JourneyMap";

export const metadata: Metadata = {
  title: "The Journey",
  description: "Eight stages from Egypt to Zion. Your road out of bondage and into freedom.",
};

export default function JourneyPage() {
  return <JourneyMap stages={stages} steps={allSteps} />;
}
