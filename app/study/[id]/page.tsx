import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { studies, studyById } from "@/content/studies";
import { versesFor } from "@/lib/verses";
import { StudySoloView } from "@/components/StudyView";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return studies.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const s = studyById(id);
  return s ? { title: s.title, description: s.blurb } : {};
}

export default async function StudyDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const study = studyById(id);
  if (!study) notFound();
  return <StudySoloView study={study} verses={versesFor(study.sessions.map((x) => x.keyVerse))} />;
}