import Link from "next/link";
import type { Metadata } from "next";
import { armorRefs } from "@/content/armor";
import { versesFor } from "@/lib/verses";
import { PlayArmor } from "@/components/PlayArena";
import { IconBack } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Armor of God",
  description: "Learn the six pieces of armor and the weapon of prayer from Ephesians 6.",
};

export default function ArmorPage() {
  const verses = versesFor([...armorRefs(), "Ephesians 6:10-18"]);
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/play" className="inline-flex items-center gap-1.5 text-sm text-night/70 hover:text-night">
        <IconBack width={16} height={16} /> Play
      </Link>
      <p className="eyebrow mt-6">Ephesians 6:10-18</p>
      <h1 className="mt-2 text-5xl">The Armor of God</h1>
      <p className="mt-3 max-w-xl text-night/75">
        Be strong in the Lord and in the strength of His might. The armor is not yours to make. It is His to give, and
        yours to put on.
      </p>
      <div className="mt-8">
        <PlayArmor verses={verses} />
      </div>
    </div>
  );
}
