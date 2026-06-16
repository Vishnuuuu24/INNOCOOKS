import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://innocooks.com";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/work/christalin-mirrors/`, priority: 0.8 },
    { url: `${base}/contact/`, priority: 0.9 },
  ];
}
