import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b1f3b",
          borderRadius: 14,
        }}
      >
        <svg width="46" height="46" viewBox="0 0 32 32">
          <path d="M4 24c4-3 7-3 12 0s8 3 12 0" stroke="#e8b86d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M16 4c2.6 3.2 4 5 4 7.5a4 4 0 0 1-8 0c0-2.500 1.400-4.300 4-7.500Z" fill="#f6dfb2" />
        </svg>
      </div>
    ),
    size,
  );
}
