import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 hidden border-t border-night/10 bg-night py-10 text-linen/80 md:block">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8 px-5">
        <div className="max-w-md">
          <p className="font-display text-2xl text-dawn-pale">Journey to Purity</p>
          <p className="mt-2 text-sm leading-relaxed">
            &ldquo;Create in me a clean heart, O God, and renew a right spirit within me.&rdquo; Psalm 51:10
          </p>
        </div>
        <div className="flex gap-10 text-sm">
          <ul className="space-y-1.5">
            <li><Link className="hover:text-dawn" href="/journey">Journey</Link></li>
            <li><Link className="hover:text-dawn" href="/play">Play</Link></li>
            <li><Link className="hover:text-dawn" href="/questions">Questions</Link></li>
          </ul>
          <ul className="space-y-1.5">
            <li><Link className="hover:text-dawn" href="/testimonies">Testimonies</Link></li>
            <li><Link className="hover:text-dawn" href="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-dawn" href="/help">Help</Link></li>
            <li><Link className="hover:text-dawn" href="/credits">Credits</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-xs text-linen/50">
        Scripture: KJV and WEB (public domain). Short quotations from ESV, NIV and NKJV are used under each
        publisher&rsquo;s permissions and credited where they appear. This is a companion for your walk, not a
        replacement for church, counsel, or medical care.
      </p>
    </footer>
  );
}
