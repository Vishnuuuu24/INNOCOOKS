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
    // Icons intentionally omitted — add your favicon set later. Drop the files in
    // app/ (icon.svg, apple-icon.png) and/or public/, then restore, e.g.:
    //   icons: [
    //     { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
    //     { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    //     { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    //   ],
  };
}
