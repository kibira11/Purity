import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { plans, planById } from "@/content/plans";
import { versesFor } from "@/lib/verses";
import { PlanView } from "@/components/PlansView";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return plans.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const p = planById(id);
  return p ? { title: p.title, description: p.blurb } : {};
}

export default async function PlanPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const plan = planById(id);
  if (!plan) notFound();
  return <PlanView plan={plan} verses={versesFor(plan.days.map((d) => d.verse))} />;
}
