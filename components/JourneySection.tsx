"use client";

import dynamic from "next/dynamic";
import { useLocale } from "./LocaleProvider";

const InteractiveGlobe = dynamic(() => import("./InteractiveGlobe"), {
  ssr: false,
  loading: () => (
    <section className="px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-white/[0.05]" />
          <div className="h-20 w-full animate-pulse rounded-lg bg-white/[0.03]" />
        </div>
        <div className="mx-auto aspect-square w-full max-w-[640px] animate-pulse rounded-full bg-gradient-to-br from-white/[0.04] via-[#e6c98b]/[0.04] to-transparent" />
      </div>
    </section>
  ),
});

export default function JourneySection() {
  const { content } = useLocale();
  const j = content.journey;

  return (
    <InteractiveGlobe
      eyebrow={j.eyebrow}
      title={j.title}
      description={j.description}
      originLabel={j.originLabel}
      destinationLabel={j.destinationLabel}
    />
  );
}
