"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { checkRateLimits } from "@/lib/rateLimit";

const schemaShape = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  email: z.string().trim().email("Invalid email"),
  message: z.string().trim().min(10, "Message is too short").max(4000),
  locale: z.string().trim().max(8).optional(),
  // honeypot — bots fill hidden fields, humans do not
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  // milliseconds since the form was rendered — submissions faster than 1.5s are bot-like
  loadedAt: z.coerce.number().int().nonnegative().optional(),
});

const MIN_FILL_MS = 1500;

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
};

function hashIp(ip: string | null) {
  if (!ip) return "anon";
  const salt = process.env.IP_HASH_SALT ?? "portfolio-default-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schemaShape.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    locale: formData.get("locale") ?? undefined,
    website: formData.get("website") ?? "",
    loadedAt: formData.get("loadedAt") ?? undefined,
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  // Honeypot — return fake success so bots don't know they were caught
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true, message: "Thanks! I'll be in touch soon." };
  }

  // Time-to-fill check — bots auto-submit faster than humans can type
  if (parsed.data.loadedAt && Date.now() - parsed.data.loadedAt < MIN_FILL_MS) {
    return { ok: true, message: "Thanks! I'll be in touch soon." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const userAgent = h.get("user-agent") ?? null;
  const ipHash = hashIp(ip);

  // Rate limit: 3 per hour, 10 per day, per IP
  const limit = await checkRateLimits(`contact:${ipHash}`, [
    { limit: 3, windowSec: 3600, suffix: "h" },
    { limit: 10, windowSec: 86_400, suffix: "d" },
  ]);
  if (!limit.ok) {
    const mins = Math.ceil(limit.resetIn / 60);
    return {
      ok: false,
      message: `Too many requests. Please try again in ~${mins} minute${mins === 1 ? "" : "s"}.`,
    };
  }

  try {
    await db.insert(schema.contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      locale: parsed.data.locale ?? null,
      userAgent,
      ipHash,
    });

    return { ok: true, message: "Thanks! Your message has been received." };
  } catch (err) {
    console.error("[submitContact] DB insert failed:", err);
    return {
      ok: false,
      message: "Something went wrong. Please email me directly.",
    };
  }
}
