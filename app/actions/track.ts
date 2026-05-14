"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { db, schema } from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";

function hashSession(ip: string | null, userAgent: string | null) {
  const salt = process.env.IP_HASH_SALT ?? "portfolio-default-salt";
  const day = new Date().toISOString().slice(0, 10);
  return crypto
    .createHash("sha256")
    .update(`${salt}:${day}:${ip ?? ""}:${userAgent ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

export async function trackPageView(path: string, referrer?: string | null) {
  try {
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const userAgent = h.get("user-agent") ?? null;
    const country =
      h.get("x-vercel-ip-country") ??
      h.get("cf-ipcountry") ??
      null;
    const sessionHash = hashSession(ip, userAgent);

    // Rate limit: 60 views per minute per session — generous for humans, catches scrapers
    const limit = await checkRateLimit(`track:${sessionHash}`, 60, 60);
    if (!limit.ok) return;

    await db.insert(schema.pageViews).values({
      path: path.slice(0, 200),
      referrer: referrer?.slice(0, 200) ?? null,
      country,
      userAgent,
      sessionHash,
    });
  } catch (err) {
    console.error("[trackPageView] failed:", err);
  }
}
