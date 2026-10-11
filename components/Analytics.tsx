"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

/** Starts visitor stats once the page is idle, so they never delay the first view. */
export function Analytics() {
  useEffect(() => {
    const start = () => initAnalytics();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 1500);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
