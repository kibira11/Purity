import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="eyebrow">No connection</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">You are offline, not abandoned.</h1>
      <p className="mt-6 font-scripture text-lg leading-relaxed text-night/85">
        &ldquo;Whither shall I go from thy spirit? or whither shall I flee from thy presence?&rdquo;
        <span className="mt-1 block text-sm text-night/70">Psalm 139:7, KJV</span>
      </p>
      <p className="mt-6 text-night/80">
        Pages you have already opened still work. Your progress is saved on this device and will sync when you are
        back online.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/flee" className="btn btn-night">
          Open the Flee page
        </Link>
        <Link href="/journey" className="btn btn-ghost">
          Back to the journey
        </Link>
      </div>
    </div>
  );
}
