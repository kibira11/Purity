import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupsView } from "@/components/GroupsView";

export const metadata: Metadata = {
  title: "Study groups",
  description: "Create or join an online Bible study group.",
};

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-night/70">Loading&hellip;</div>}>
      <GroupsView />
    </Suspense>
  );
}