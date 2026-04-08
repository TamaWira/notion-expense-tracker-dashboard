"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CategoryStat } from "@/types";
import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";
import { useIsDark } from "@/lib/useIsDark";

const COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

interface Props {
  data: CategoryStat[];
}

export default function SpendingByCategoryChart({ data }: Props) {
  const { hidden } = useHideNumbers();
  const isDark = useIsDark();

  const gridColor  = isDark ? "#374151" : "#f0f0f0";
  const tickColor  = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg  = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  if (data.length === 0) {
    return <EmptyState label="No data this month." />;
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-700 dark:text-gray-200">
        Amount by Category
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 40, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: tickColor }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tickFormatter={hidden ? () => "••••" : (v) => `${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11, fill: tickColor }}
            width={56}
          />
          <Tooltip
            formatter={hidden ? () => "••••••" : (value) => formatIDR(Number(value))}
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder }}
            labelStyle={{ color: tickColor }}
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
      {label}
    </div>
  );
}
