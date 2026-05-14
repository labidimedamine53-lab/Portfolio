"use server";

import crypto from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db, ensureDatabase, schema } from "@/lib/db";
import { checkRateLimits } from "@/lib/rateLimit";

const schemaShape = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name must be 120 characters or fewer"),
  email: z.string().trim().email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(4000, "Message must be 4000 characters or fewer"),
  locale: z.string().trim().max(8).optional(),
});

const fieldLabels = {
  name: "Name",
  email: "Email",
  message: "Message",
} as const;

type VisibleField = keyof typeof fieldLabels;

export type ContactState = {
  ok: boolean;
  message: string;
  errors?: Partial<Record<VisibleField, string>>;
};

function hashIp(ip: string | null) {
  if (!ip) return "anon";
  const salt = process.env.IP_HASH_SALT ?? "portfolio-default-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function getValidationErrors(
  fieldErrors: Partial<Record<string, string[] | undefined>>,
) {
  const errors: Partial<Record<VisibleField, string>> = {};

  for (const field of Object.keys(fieldLabels) as VisibleField[]) {
    const error = fieldErrors[field]?.[0];
    if (error) errors[field] = error;
  }

  return errors;
}

function formatValidationMessage(errors: Partial<Record<VisibleField, string>>) {
  const details = (Object.keys(fieldLabels) as VisibleField[])
    .filter((field) => errors[field])
    .map((field) => `${fieldLabels[field]}: ${errors[field]}`);

  return details.length > 0
    ? `Please fix ${details.join("; ")}.`
    : "Please check the form and try again.";
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
  });

  if (!parsed.success) {
    const errors = getValidationErrors(parsed.error.flatten().fieldErrors);

    return {
      ok: false,
      message: formatValidationMessage(errors),
      errors,
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    null;
  const userAgent = h.get("user-agent") ?? null;
  const ipHash = hashIp(ip);

  try {
    await ensureDatabase();
  } catch (err) {
    console.error("[submitContact] DB setup failed:", err);
    return {
      ok: false,
      message: "Your message could not be saved because the database is unavailable.",
    };
  }

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
      message: "Your message could not be saved. Please email me directly.",
    };
  }
}
