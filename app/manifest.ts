import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Journey to Purity",
    short_name: "Purity",
    description: "A walk out of bondage and into freedom: Scripture, science and the body, with a friend beside you.",
    start_url: "/journey",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1b1f3b",
    theme_color: "#1b1f3b",
    categories: ["lifestyle", "education", "health"],
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Flee: I need help now", short_name: "Flee", url: "/flee" },
      { name: "Today's check-in", short_name: "Lamp", url: "/checkin" },
      { name: "Continue the journey", short_name: "Journey", url: "/journey" },
    ],
  };
}
