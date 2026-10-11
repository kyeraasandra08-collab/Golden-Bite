import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

/** Built once as a plain file (the site is a static export). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
