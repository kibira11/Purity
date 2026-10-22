import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";
import { FleeFab } from "@/components/FleeFab";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "The Journey to Purity",
    template: "%s | The Journey to Purity",
  },
  description:
    "A walk out of bondage and into freedom: Scripture, science and the body, with a friend beside you. Eight stages, one conquest.",
  applicationName: "Journey to Purity",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Purity", statusBarStyle: "black-translucent" },
  openGraph: {
    title: "The Journey to Purity",
    description: "Walk out of bondage and into freedom, together.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b1f3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-linen"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="min-h-[70vh] pb-28 md:pb-12">
            {children}
          </main>
          <SiteFooter />
          <FleeFab />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
