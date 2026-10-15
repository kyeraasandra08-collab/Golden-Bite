import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

/** Built once as a plain file (the site is a static export). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: business.siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${business.siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
