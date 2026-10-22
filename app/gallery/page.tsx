import type { Metadata } from "next";
import { artworks } from "@/content/art";
import { stages } from "@/content/stages";
import { GalleryView } from "@/components/GalleryView";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Classical and ancient art that has pictured this road, with the story behind each piece.",
};

export default function Gallery() {
  const order = Object.fromEntries(stages.map((s, i) => [s.id, i]));
  const works = artworks.slice().sort((a, b) => (order[a.stage ?? ""] ?? 99) - (order[b.stage ?? ""] ?? 99));
  const stageNames = Object.fromEntries(stages.map((s) => [s.id, s.name]));
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Look slowly</p>
      <h1 className="mt-2 text-5xl sm:text-6xl">Gallery</h1>
      <p className="mt-4 max-w-2xl text-lg text-night/75">
        For centuries, artists have tried to picture what this journey feels like: the chains, the sea, the wilderness,
        the return home. Each piece here is in the public domain or freely licensed, with its story and credit.
      </p>
      <GalleryView works={works} stageNames={stageNames} />
    </div>
  );
}
