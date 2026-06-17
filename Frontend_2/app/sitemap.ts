import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://innocooks.com";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/contact/`, priority: 0.9 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}/`, priority: 0.8 })),
  ];
}
