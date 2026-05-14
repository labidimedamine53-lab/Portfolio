"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EASE = [0.16, 1, 0.3, 1] as const;

const ACCENT = "#e6c98b";
const ACCENT_SOFT = "rgba(230, 201, 139, 0.18)";
const TEXT_DIM = "#71717a";
const GRID = "rgba(255, 255, 255, 0.06)";

export const PALETTE = [
  "#e6c98b",
  "#f5f5f7",
  "#a1a1aa",
  "#d4d4d8",
  "#52525b",
  "#71717a",
] as const;

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#e6c98b]/30 bg-[#050505]/95 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] shadow-2xl backdrop-blur-xl">
      {label !== undefined ? (
        <p className="mb-1 text-zinc-500">{String(label)}</p>
      ) : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 text-white">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: p.color ?? ACCENT }}
          />
          <span className="text-zinc-400">{p.name}</span>
          <span className="ml-auto tabular-nums text-[#e6c98b]">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function LineAreaChart({
  data,
  xKey,
  yKey,
  height = 220,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={xKey}
          stroke={TEXT_DIM}
          tick={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke={TEXT_DIM}
          tick={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ stroke: ACCENT_SOFT, strokeWidth: 1 }}
          content={<TooltipBox />}
        />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={ACCENT}
          strokeWidth={2}
          fill="url(#lineFill)"
          dot={false}
          activeDot={{
            r: 4,
            fill: ACCENT,
            stroke: "#050505",
            strokeWidth: 2,
          }}
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MiniLine({
  data,
  yKey,
  height = 36,
}: {
  data: Array<Record<string, string | number>>;
  yKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={ACCENT}
          strokeWidth={1.6}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function VerticalBarChart({
  data,
  xKey,
  yKey,
  height = 240,
  color = ACCENT,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={xKey}
          stroke={TEXT_DIM}
          tick={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
          tickLine={false}
          axisLine={{ stroke: GRID }}
          interval={0}
        />
        <YAxis
          stroke={TEXT_DIM}
          tick={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
          tickLine={false}
          axisLine={false}
          width={36}
          allowDecimals={false}
        />
        <Tooltip cursor={{ fill: "rgba(230,201,139,0.06)" }} content={<TooltipBox />} />
        <Bar
          dataKey={yKey}
          fill="url(#barFill)"
          radius={[6, 6, 0, 0]}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function HorizontalBars({
  data,
  labelKey,
  valueKey,
  max,
}: {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKey: string;
  max?: number;
}) {
  if (data.length === 0) {
    return <p className="text-sm text-zinc-500">No data yet.</p>;
  }
  const maxVal = max ?? Math.max(...data.map((d) => Number(d[valueKey]) || 0));
  return (
    <ul className="grid gap-3">
      {data.map((row, i) => {
        const value = Number(row[valueKey]) || 0;
        const pct = maxVal > 0 ? (value / maxVal) * 100 : 0;
        return (
          <motion.li
            key={`${row[labelKey]}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.04 }}
            className="grid gap-1.5"
          >
            <div className="flex items-baseline justify-between text-xs">
              <span className="truncate font-medium text-zinc-300">
                {String(row[labelKey])}
              </span>
              <span className="font-mono tabular-nums text-[#e6c98b]">{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: EASE, delay: i * 0.04 + 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-[#e6c98b] to-white"
              />
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

export function DonutChart({
  data,
  height = 220,
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div style={{ height }} className="grid place-items-center text-sm text-zinc-500">
        No data yet.
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          dataKey="value"
          stroke="#050505"
          strokeWidth={2}
          animationDuration={1200}
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<TooltipBox />} />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: 10,
            fontFamily: "ui-monospace, monospace",
            color: TEXT_DIM,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            paddingTop: 8,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
