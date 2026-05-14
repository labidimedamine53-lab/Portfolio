import { and, eq, lt, sql } from "drizzle-orm";
import { db, ensureDatabase, schema } from "@/lib/db";

export type RateLimitResult = {
  ok: boolean;
  count: number;
  limit: number;
  remaining: number;
  resetIn: number;
};

let lastCleanup = 0;

async function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  const cutoff = Math.floor(now / 1000) - 86_400;
  try {
    await db.delete(schema.rateLimitBuckets).where(lt(schema.rateLimitBuckets.windowStart, cutoff));
  } catch (err) {
    console.error("[rateLimit] cleanup failed:", err);
  }
}

/**
 * Fixed-window rate limiter backed by libSQL.
 *
 * @param key         unique bucket key (e.g. `contact:<ipHash>`)
 * @param limit       max requests per window
 * @param windowSec   window length in seconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  void maybeCleanup();

  const nowSec = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(nowSec / windowSec) * windowSec;

  try {
    await ensureDatabase();
    await db
      .insert(schema.rateLimitBuckets)
      .values({ key, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: [schema.rateLimitBuckets.key, schema.rateLimitBuckets.windowStart],
        set: { count: sql`${schema.rateLimitBuckets.count} + 1` },
      });

    const [row] = await db
      .select({ count: schema.rateLimitBuckets.count })
      .from(schema.rateLimitBuckets)
      .where(
        and(
          eq(schema.rateLimitBuckets.key, key),
          eq(schema.rateLimitBuckets.windowStart, windowStart),
        ),
      );

    const count = row?.count ?? 0;
    return {
      ok: count <= limit,
      count,
      limit,
      remaining: Math.max(0, limit - count),
      resetIn: windowStart + windowSec - nowSec,
    };
  } catch (err) {
    // Fail open on DB errors so the site doesn't break, but log loudly
    console.error("[rateLimit] check failed:", err);
    return { ok: true, count: 0, limit, remaining: limit, resetIn: windowSec };
  }
}

/**
 * Multi-window check — convenient for combined "per-minute AND per-hour" limits.
 * Returns the first failing result, or the most restrictive remaining if all pass.
 */
export async function checkRateLimits(
  key: string,
  windows: Array<{ limit: number; windowSec: number; suffix?: string }>,
): Promise<RateLimitResult> {
  let strictest: RateLimitResult | null = null;
  for (const w of windows) {
    const result = await checkRateLimit(`${key}:${w.suffix ?? w.windowSec}`, w.limit, w.windowSec);
    if (!result.ok) return result;
    if (!strictest || result.remaining < strictest.remaining) strictest = result;
  }
  return strictest ?? { ok: true, count: 0, limit: 0, remaining: 0, resetIn: 0 };
}
