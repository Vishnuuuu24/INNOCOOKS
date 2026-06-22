import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InnoCooks · Systems Studio",
    short_name: "InnoCooks",
    description:
      "Websites, internal management systems and AI automation for growing businesses.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#121112",
    theme_color: "#121112",
    icons: [
      { src: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { src: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
