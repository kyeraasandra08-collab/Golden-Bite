import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL && !process.env.CI) {
  console.warn(
    "\n⚠  NEXT_PUBLIC_SITE_URL is not set: canonical, sitemap and social-preview links will point to localhost.\n" +
      "   Set it to the live address (e.g. https://goldenbite.com.gh) in your hosting settings.\n",
  );
}

/** This computer's own network addresses, e.g. 192.168.1.20 on home Wi-Fi. */
const localAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

/**
 * The whole site is pre-built as plain files (`npm run build` writes them to out/), so it can be
 * hosted free on Cloudflare Pages with no server to keep awake. Security headers for the live site
 * are in public/_headers, which Cloudflare Pages reads.
 */
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  /**
   * Photos are already resized and saved as WebP by `npm run photos`, so they are served as-is.
   * Resizing them on request made the small hosting server take ~10 s per photo on first view.
   */
  images: { unoptimized: true },
  /**
   * `npm run dev` only serves its JavaScript to http://localhost by default. Opening the site as
   * http://127.0.0.1:3000, or from a phone on the same Wi-Fi (http://192.168.x.x:3000), would load
   * the page but leave every button dead. This allows those addresses. Development only: it has no
   * effect on the live site. Only run the dev server on Wi-Fi you trust.
   */
  allowedDevOrigins: ["127.0.0.1", ...localAddresses],
};

export default nextConfig;
