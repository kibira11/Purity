import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #1b1f3b 0%, #3b3568 100%)",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
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
    size,
  );
}
