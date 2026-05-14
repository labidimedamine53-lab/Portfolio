import { desc, sql } from "drizzle-orm";
import { db, schema } from "./index";

export type DailyPoint = { date: string; views: number };
export type HourPoint = { hour: string; views: number };
export type LabelCount = { label: string; count: number };
export type LocaleCount = { name: string; value: number };

export async function loadDashboardData() {
  const [
    messages,
    totalViews,
    viewsLast7d,
    viewsLast30dRows,
    viewsPrev7d,
    uniqueSessionsLast7d,
    topPaths,
    topCountries,
    hourly,
    daily,
    referrers,
    locales,
    latestEvents,
  ] = await Promise.all([
    db
      .select()
      .from(schema.contactMessages)
      .orderBy(desc(schema.contactMessages.createdAt))
      .limit(50),
    db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews)
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.createdAt} >= datetime('now', '-7 days')`)
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({
        date: sql<string>`date(${schema.pageViews.createdAt})`,
        views: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.createdAt} >= datetime('now', '-30 days')`)
      .groupBy(sql`date(${schema.pageViews.createdAt})`)
      .orderBy(sql`date(${schema.pageViews.createdAt})`),
    db
      .select({ count: sql<number>`count(*)` })
      .from(schema.pageViews)
      .where(
        sql`${schema.pageViews.createdAt} >= datetime('now', '-14 days') AND ${schema.pageViews.createdAt} < datetime('now', '-7 days')`,
      )
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({
        count: sql<number>`count(distinct ${schema.pageViews.sessionHash})`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.createdAt} >= datetime('now', '-7 days')`)
      .then((r) => Number(r[0]?.count ?? 0)),
    db
      .select({
        label: schema.pageViews.path,
        count: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .groupBy(schema.pageViews.path)
      .orderBy(sql`count(*) desc`)
      .limit(8),
    db
      .select({
        label: schema.pageViews.country,
        count: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.country} is not null`)
      .groupBy(schema.pageViews.country)
      .orderBy(sql`count(*) desc`)
      .limit(8),
    db
      .select({
        hour: sql<string>`strftime('%H', ${schema.pageViews.createdAt})`,
        views: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.createdAt} >= datetime('now', '-7 days')`)
      .groupBy(sql`strftime('%H', ${schema.pageViews.createdAt})`),
    db
      .select({
        date: sql<string>`date(${schema.pageViews.createdAt})`,
        views: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.createdAt} >= datetime('now', '-7 days')`)
      .groupBy(sql`date(${schema.pageViews.createdAt})`),
    db
      .select({
        label: schema.pageViews.referrer,
        count: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.referrer} is not null and ${schema.pageViews.referrer} != ''`)
      .groupBy(schema.pageViews.referrer)
      .orderBy(sql`count(*) desc`)
      .limit(6),
    db
      .select({
        label: schema.contactMessages.locale,
        count: sql<number>`count(*)`,
      })
      .from(schema.contactMessages)
      .groupBy(schema.contactMessages.locale),
    db
      .select()
      .from(schema.pageViews)
      .orderBy(desc(schema.pageViews.createdAt))
      .limit(15),
  ]);

  // Build a contiguous 30-day series so the line chart doesn't have gaps
  const daily30Map = new Map(
    viewsLast30dRows.map((r) => [String(r.date), Number(r.views)]),
  );
  const dailySeries: DailyPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const iso = d.toISOString().slice(0, 10);
    dailySeries.push({
      date: iso.slice(5),
      views: daily30Map.get(iso) ?? 0,
    });
  }

  // 24-hour buckets — fill missing hours with 0
  const hourMap = new Map(
    hourly.map((r) => [String(r.hour), Number(r.views)]),
  );
  const hourSeries: HourPoint[] = [];
  for (let h = 0; h < 24; h++) {
    const key = String(h).padStart(2, "0");
    hourSeries.push({ hour: key, views: hourMap.get(key) ?? 0 });
  }

  // Trend: views in last 7 vs prior 7
  const trendPct =
    viewsPrev7d === 0
      ? viewsLast7d > 0
        ? 100
        : 0
      : Math.round(((viewsLast7d - viewsPrev7d) / viewsPrev7d) * 100);

  const avgDaily =
    dailySeries.length > 0
      ? Math.round(
          dailySeries.reduce((s, d) => s + d.views, 0) / dailySeries.length,
        )
      : 0;

  const topPathsClean: LabelCount[] = topPaths.map((r) => ({
    label: String(r.label).length > 30 ? String(r.label).slice(0, 30) + "…" : String(r.label),
    count: Number(r.count),
  }));

  const topCountriesClean: LabelCount[] = topCountries.map((r) => ({
    label: r.label ?? "—",
    count: Number(r.count),
  }));

  const localeDonut: LocaleCount[] = locales.map((r) => ({
    name: (r.label ?? "unknown").toUpperCase(),
    value: Number(r.count),
  }));

  const referrersClean: LabelCount[] = referrers.map((r) => {
    let label = String(r.label ?? "—");
    try {
      const u = new URL(label);
      label = u.hostname;
    } catch {
      // not a URL, keep as is
    }
    return { label: label.length > 28 ? label.slice(0, 28) + "…" : label, count: Number(r.count) };
  });

  return {
    messages,
    totalViews,
    viewsLast7d,
    viewsPrev7d,
    uniqueSessionsLast7d,
    avgDaily,
    trendPct,
    dailySeries,
    hourSeries,
    topPaths: topPathsClean,
    topCountries: topCountriesClean,
    countriesDonut: topCountriesClean.slice(0, 5).map((c) => ({
      name: c.label,
      value: c.count,
    })),
    referrers: referrersClean,
    localeDonut,
    latestEvents,
  };
}
