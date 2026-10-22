import { ImageResponse } from "next/og";

type Params = { size: string };

export function generateStaticParams(): Params[] {
  return [{ size: "192" }, { size: "512" }, { size: "maskable" }];
}

/** The app icon: a flame above water, on night. Generated at build time, no image files to keep. */
export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { size } = await params;
  const maskable = size === "maskable";
  const px = maskable ? 512 : Number(size) || 512;
  // Maskable icons need a safe zone: keep the mark inside the middle 80%.
  const inner = maskable ? px * 0.62 : px * 0.8;

  return new ImageResponse(
    (
      <div
        style={{
          width: px,
          height: px,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #1b1f3b 0%, #3b3568 100%)",
          borderRadius: maskable ? 0 : px * 0.22,
        }}
      >
        <svg width={inner} height={inner} viewBox="0 0 32 32">
          <defs>
            <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#c8903f" />
              <stop offset="1" stopColor="#f6dfb2" />
            </linearGradient>
          </defs>
          <path d="M4 24c4-3 7-3 12 0s8 3 12 0" stroke="url(#g)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M16 4c2.6 3.2 4 5 4 7.5a4 4 0 0 1-8 0c0-2.500 1.400-4.300 4-7.500Z" fill="url(#g)" />
        </svg>
      </div>
    ),
    { width: px, height: px },
  );
}
