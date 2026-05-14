"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GlobeMethods } from "react-globe.gl";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1] as const;

// ISO 3166-1 numeric IDs in world-atlas TopoJSON
const HIGHLIGHT_IDS = new Set(["788", "380"]); // Tunisia, Italy

const ORIGIN = { lat: 36.8065, lng: 10.1815, label: "Tunis", country: "Tunisia" };
const DESTINATION = { lat: 41.9028, lng: 12.4964, label: "Rome", country: "Italy" };

type Feature = {
  type: "Feature";
  id?: string | number;
  properties?: Record<string, unknown>;
  geometry: unknown;
};

type GlobeProps = {
  title: string;
  eyebrow: string;
  description: string;
  originLabel: string;
  destinationLabel: string;
};

export default function InteractiveGlobe({
  title,
  eyebrow,
  description,
  originLabel,
  destinationLabel,
}: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [size, setSize] = useState({ width: 600, height: 600 });
  const [ready, setReady] = useState(false);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);

  // Load country polygons from local TopoJSON
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [{ feature }, world] = await Promise.all([
          import("topojson-client"),
          fetch("/geo/countries-110m.json").then((r) => r.json()),
        ]);
        if (cancelled) return;
        const collection = feature(world, world.objects.countries) as unknown as {
          features: Feature[];
        };
        setFeatures(collection.features);
      } catch (err) {
        console.error("[InteractiveGlobe] failed to load geo data", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Responsive sizing — square, capped
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = Math.min(w, 640);
        setSize({ width: w, height: h });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Configure globe once ready
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    const controls = g.controls() as {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableZoom: boolean;
      enablePan: boolean;
      enableDamping: boolean;
      dampingFactor: number;
    };
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    // Frame the Mediterranean so TN-IT arc is visible on first render
    g.pointOfView({ lat: 38, lng: 14, altitude: 2.0 }, 1200);
  }, [ready]);

  const arcsData = useMemo(
    () => [
      {
        startLat: ORIGIN.lat,
        startLng: ORIGIN.lng,
        endLat: DESTINATION.lat,
        endLng: DESTINATION.lng,
      },
    ],
    [],
  );

  const points = useMemo(
    () => [
      { ...ORIGIN, label: originLabel },
      { ...DESTINATION, label: destinationLabel },
    ],
    [originLabel, destinationLabel],
  );

  return (
    <section
      id="journey"
      className="relative overflow-hidden px-5 py-24 sm:px-8 lg:px-10"
    >
      {/* Section ambient backdrop — keeps focus on the globe */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,201,139,0.05),transparent_55%)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.95, ease: EASE }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-xl">
            <span className="h-1 w-1 rounded-full bg-[#e6c98b] shadow-[0_0_10px_rgba(230,201,139,0.8)]" />
            {eyebrow}
          </div>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400 sm:text-[1.05rem]">
            {description}
          </p>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:max-w-md sm:grid-cols-2">
            <CountryCard
              code="TN"
              flag="🇹🇳"
              label={originLabel}
              country={ORIGIN.country}
              active={activeCountry === "788"}
            />
            <CountryCard
              code="IT"
              flag="🇮🇹"
              label={destinationLabel}
              country={DESTINATION.country}
              active={activeCountry === "380"}
            />
          </div>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="relative mx-auto aspect-square w-full max-w-[640px]"
          initial={{ opacity: 0, scale: 0.92, filter: "blur(16px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {/* Decorative rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 rounded-full border border-white/[0.04]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-16 rounded-full border border-white/[0.03]"
          />

          {/* Loading shimmer until globe ready */}
          {!ready ? (
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-[#e6c98b]/10 via-white/[0.04] to-transparent blur-2xl" />
            </div>
          ) : null}

          {features.length > 0 ? (
            <Globe
              ref={globeRef}
              width={size.width}
              height={size.height}
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor="#e6c98b"
              atmosphereAltitude={0.18}
              showGraticules={true}
              globeImageUrl={undefined}
              // Polygon layer — countries
              polygonsData={features}
              polygonAltitude={(d) =>
                HIGHLIGHT_IDS.has(String((d as Feature).id ?? "")) ? 0.012 : 0.006
              }
              polygonCapColor={(d) => {
                const id = String((d as Feature).id ?? "");
                if (HIGHLIGHT_IDS.has(id)) return "rgba(230, 201, 139, 0.85)";
                return "rgba(255, 255, 255, 0.04)";
              }}
              polygonSideColor={(d) => {
                const id = String((d as Feature).id ?? "");
                if (HIGHLIGHT_IDS.has(id)) return "rgba(230, 201, 139, 0.25)";
                return "rgba(255, 255, 255, 0.03)";
              }}
              polygonStrokeColor={(d) => {
                const id = String((d as Feature).id ?? "");
                if (HIGHLIGHT_IDS.has(id)) return "#ffffff";
                return "rgba(255, 255, 255, 0.18)";
              }}
              polygonLabel={(d) => {
                const props = (d as Feature).properties as
                  | { name?: string }
                  | undefined;
                return props?.name
                  ? `<div style="background:rgba(5,5,5,0.92);border:1px solid rgba(230,201,139,0.35);padding:6px 10px;border-radius:8px;color:#fff;font-size:11px;font-family:ui-monospace,monospace;letter-spacing:0.08em;text-transform:uppercase;">${props.name}</div>`
                  : "";
              }}
              onPolygonHover={(d) => {
                const id = d ? String((d as Feature).id ?? "") : null;
                setActiveCountry(id);
              }}
              // Arc — TN -> IT journey
              arcsData={arcsData}
              arcColor={() => ["rgba(230, 201, 139, 0.95)", "#ffffff"]}
              arcStroke={0.45}
              arcAltitude={0.18}
              arcDashLength={0.4}
              arcDashGap={0.6}
              arcDashAnimateTime={2400}
              // Point markers
              pointsData={points}
              pointLat="lat"
              pointLng="lng"
              pointColor={() => "#e6c98b"}
              pointAltitude={0.012}
              pointRadius={0.4}
              pointLabel={(d) => {
                const p = d as { label: string; country: string };
                return `<div style="background:rgba(5,5,5,0.92);border:1px solid rgba(230,201,139,0.5);padding:6px 10px;border-radius:8px;color:#fff;font-size:11px;font-family:ui-monospace,monospace;letter-spacing:0.08em;text-transform:uppercase;">${p.label} · ${p.country}</div>`;
              }}
              // Ripple rings at endpoints
              ringsData={points}
              ringLat="lat"
              ringLng="lng"
              ringColor={() => (t: number) => `rgba(230, 201, 139, ${1 - t})`}
              ringMaxRadius={4}
              ringPropagationSpeed={1.6}
              ringRepeatPeriod={1800}
              onGlobeReady={() => setReady(true)}
            />
          ) : null}

          {/* Corner hairlines for premium framing */}
          <div className="pointer-events-none absolute left-0 top-0 h-px w-20 bg-gradient-to-r from-[#e6c98b]/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-px w-20 bg-gradient-to-l from-zinc-100/80 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 h-20 w-px bg-gradient-to-b from-[#e6c98b]/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-20 w-px bg-gradient-to-t from-zinc-100/80 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

function CountryCard({
  code,
  flag,
  label,
  country,
  active,
}: {
  code: string;
  flag: string;
  label: string;
  country: string;
  active: boolean;
}) {
  return (
    <div
      className={`relative bg-[#070708]/80 p-5 backdrop-blur-xl transition-colors ${
        active ? "bg-[#e6c98b]/[0.06]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{flag}</span>
        <span className="font-mono text-[0.65rem] font-semibold tracking-[0.22em] text-[#e6c98b]">
          {code}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tracking-tight text-white">
        {country}
      </p>
      {active ? (
        <span
          aria-hidden="true"
          className="absolute left-5 top-0 h-px w-12 bg-gradient-to-r from-[#e6c98b]/80 to-transparent"
        />
      ) : null}
    </div>
  );
}
