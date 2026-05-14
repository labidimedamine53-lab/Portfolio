"use client";

import { useEffect, useRef } from "react";
import { trackPageView } from "@/app/actions/track";

export default function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const path = window.location.pathname + window.location.search;
    const referrer = document.referrer || null;
    void trackPageView(path, referrer);
  }, []);

  return null;
}
