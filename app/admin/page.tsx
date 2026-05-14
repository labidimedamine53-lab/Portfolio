import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Inbox,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import {
  DonutChart,
  HorizontalBars,
  LineAreaChart,
  MiniLine,
  VerticalBarChart,
} from "@/components/admin/Charts";
import { loadDashboardData } from "@/lib/db/analytics";
import { databaseStatus } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AdminPage() {
  let data: Awaited<ReturnType<typeof loadDashboardData>>;
  try {
    data = await loadDashboardData();
  } catch (err) {
    console.error("[AdminPage] failed to load dashboard:", err);
    return (
      <main className="mx-auto max-w-7xl px-5 py-12 text-zinc-200 sm:px-8">
        <Header />
        <DatabaseErrorNotice />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 text-zinc-200 sm:px-8">
      <Header />
      {databaseStatus.temporary ? <TemporaryDatabaseNotice /> : null}

      {/* Top metrics */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total page views"
          value={data.totalViews}
          delta={data.trendPct}
          deltaLabel="vs. prior 7 d"
          icon={Eye}
          sparkData={data.dailySeries.slice(-14)}
        />
        <MetricCard
          label="Views — last 7 days"
          value={data.viewsLast7d}
          delta={data.trendPct}
          deltaLabel="WoW"
          icon={Activity}
          sparkData={data.dailySeries.slice(-7)}
        />
        <MetricCard
          label="Unique visitors (7 d)"
          value={data.uniqueSessionsLast7d}
          icon={Users}
        />
        <MetricCard
          label="Contact messages"
          value={data.messages.length}
          icon={Inbox}
        />
      </section>

      {/* Primary charts */}
      <section className="mt-6 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Page views — last 30 days"
          subtitle={`Avg ${data.avgDaily}/day · ${data.viewsLast7d} this week`}
        >
          <LineAreaChart data={data.dailySeries} xKey="date" yKey="views" height={260} />
        </Panel>

        <Panel title="Top countries" subtitle="Where visitors come from">
          <DonutChart data={data.countriesDonut} height={260} />
        </Panel>
      </section>

      {/* Secondary row */}
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Activity by hour" subtitle="Aggregated over the last 7 days (UTC)">
          <VerticalBarChart data={data.hourSeries} xKey="hour" yKey="views" height={220} />
        </Panel>
        <Panel title="Top pages" subtitle="Most visited paths">
          <HorizontalBars data={data.topPaths} labelKey="label" valueKey="count" />
        </Panel>
      </section>

      {/* Tertiary row */}
      <section className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Referrers" subtitle="Where traffic arrives from">
          <HorizontalBars data={data.referrers} labelKey="label" valueKey="count" />
        </Panel>
        <Panel title="Country breakdown" subtitle="Detailed split">
          <HorizontalBars data={data.topCountries} labelKey="label" valueKey="count" />
        </Panel>
        <Panel title="Locale" subtitle="Contact submissions by language">
          <DonutChart data={data.localeDonut} height={200} />
        </Panel>
      </section>

      {/* Activity + Messages */}
      <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="Recent activity" subtitle="Latest 15 events">
          <ActivityFeed events={data.latestEvents} />
        </Panel>
        <Panel
          title="Contact inbox"
          subtitle={`${data.messages.length} message${data.messages.length === 1 ? "" : "s"}`}
        >
          <MessagesList messages={data.messages} />
        </Panel>
      </section>
    </main>
  );
}

function DatabaseErrorNotice() {
  return (
    <section className="mt-6 rounded-2xl border border-red-300/25 bg-red-300/[0.07] px-5 py-4 text-sm leading-6 text-red-100">
      <p className="font-semibold text-red-50">The admin database could not be opened.</p>
      <p className="mt-1 text-red-100/80">
        Check your deployed environment variables for
        <span className="font-mono text-red-50"> DATABASE_URL </span>
        and
        <span className="font-mono text-red-50"> DATABASE_AUTH_TOKEN</span>.
        Local
        <span className="font-mono text-red-50"> .env.local </span>
        values are not included automatically when the site is online.
      </p>
    </section>
  );
}

function TemporaryDatabaseNotice() {
  return (
    <section className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/[0.07] px-5 py-4 text-sm leading-6 text-amber-100">
      <p className="font-semibold text-amber-50">Production database is not configured.</p>
      <p className="mt-1 text-amber-100/80">
        The online app is using temporary server storage. Contact messages can work,
        but they may disappear after a redeploy or cold start. Set
        <span className="font-mono text-amber-50"> DATABASE_URL </span>
        and
        <span className="font-mono text-amber-50"> DATABASE_AUTH_TOKEN </span>
        in your host to make the inbox persistent.
      </p>
    </section>
  );
}

function Header() {
  const ts = new Date();
  return (
    <header className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#e6c98b]">
          Admin · Analytics
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Real-time view of portfolio traffic, engagement, and inbound messages.
        </p>
      </div>
      <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-zinc-500">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
          <span className="relative h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#e6c98b]/60" />
            <span className="absolute inset-0 rounded-full bg-[#e6c98b]" />
          </span>
          Live
        </span>
        <span>{ts.toISOString().slice(0, 19).replace("T", " ")} UTC</span>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  sparkData,
}: {
  label: string;
  value: number;
  delta?: number;
  deltaLabel?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  sparkData?: Array<{ date: string; views: number }>;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-xl transition-colors hover:border-white/20">
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#e6c98b]/[0.05] blur-3xl"
      />
      <div className="relative flex items-start justify-between">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-zinc-400">
          {label}
        </p>
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-[#e6c98b]">
          <Icon size={16} />
        </span>
      </div>
      <p className="relative mt-3 text-3xl font-semibold tabular-nums tracking-tight text-white">
        {value.toLocaleString()}
      </p>
      <div className="relative mt-3 flex items-end justify-between gap-3">
        {delta !== undefined && deltaLabel ? (
          <span
            className={`inline-flex items-center gap-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] ${
              positive ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {positive ? "+" : ""}
            {delta}% · {deltaLabel}
          </span>
        ) : (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">
            All-time
          </span>
        )}
        {sparkData && sparkData.length > 0 ? (
          <div className="w-24">
            <MiniLine data={sparkData} yKey="views" height={36} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
      <div className="absolute left-0 top-0 h-px w-20 bg-gradient-to-r from-[#e6c98b]/60 to-transparent" />
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
          {title}
        </h2>
        {subtitle ? (
          <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 sm:block">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ActivityFeed({
  events,
}: {
  events: Array<{
    id: number;
    path: string;
    country: string | null;
    referrer: string | null;
    createdAt: string;
  }>;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-zinc-500">No activity yet.</p>;
  }
  return (
    <ul className="grid gap-2.5">
      {events.map((e) => (
        <li
          key={e.id}
          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
        >
          <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[#e6c98b]">
            <Eye size={12} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-white">{e.path}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-500">
              {e.country ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={10} /> {e.country}
                </span>
              ) : null}
              <span>{e.createdAt.slice(11, 19)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MessagesList({
  messages,
}: {
  messages: Array<{
    id: number;
    name: string;
    email: string;
    message: string;
    locale: string | null;
    createdAt: string;
  }>;
}) {
  if (messages.length === 0) {
    return (
      <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-sm text-zinc-500">
        No messages yet — the contact form is live and waiting.
      </p>
    );
  }
  return (
    <ul className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
      {messages.slice(0, 10).map((m) => (
        <li
          key={m.id}
          className="rounded-xl border border-white/10 bg-white/[0.025] p-4 transition-colors hover:border-[#e6c98b]/25"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em]">
            <span className="text-[#e6c98b]">
              #{m.id} · {(m.locale ?? "—").toUpperCase()}
            </span>
            <span className="text-zinc-500">{m.createdAt}</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-white">
            <Mail size={14} className="text-zinc-500" />
            {m.name}
            <span className="text-zinc-500">·</span>
            <a
              href={`mailto:${m.email}`}
              className="text-[#e6c98b] hover:underline"
            >
              {m.email}
            </a>
          </p>
          <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
            {m.message}
          </p>
        </li>
      ))}
    </ul>
  );
}
