import type { PostHog } from "posthog-js";

/**
 * Visitor stats with PostHog, in cookie-free mode: no cookies or browser storage, so no cookie
 * banner is needed. Only counts and menu facts are sent: never names, phone numbers, locations or
 * notes. Stats switch on only when NEXT_PUBLIC_POSTHOG_KEY is set (in the hosting settings), so
 * local development and tests send nothing. PostHog is loaded after the page, never slowing it.
 */
type Events = {
  "Add to basket": { dish: string; price: number };
  "Order sent": { items: number; total: number; fulfilment: string; payment: string };
  Reorder: { items: number; total: number };
  "Catering enquiry": { eventType: string; guests: number };
  Tour: { action: "started" | "skipped" | "finished" };
};

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let client: PostHog | null = null;
let loading = false;
const queue: [string, Record<string, unknown>][] = [];

export function initAnalytics() {
  if (!KEY || loading || typeof window === "undefined") return;
  loading = true;
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        cookieless_mode: "always",
        person_profiles: "never",
        capture_pageview: true,
        capture_pageleave: true,
        // Keep it to page views and our own events: no click recording or replays.
        autocapture: false,
        disable_session_recording: true,
        disable_surveys: true,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_exceptions: false,
        capture_performance: false,
        advanced_disable_flags: true,
      });
      client = posthog;
      for (const [name, data] of queue.splice(0)) posthog.capture(name, data);
    })
    .catch(() => {
      // Blocked by an ad blocker or offline: ordering carries on without stats.
    });
}

export function trackEvent<K extends keyof Events>(name: K, data: Events[K]) {
  if (!KEY) return;
  try {
    if (client) client.capture(name, data);
    else if (queue.length < 50) queue.push([name, data]);
  } catch {
    // Analytics must never break ordering.
  }
}
