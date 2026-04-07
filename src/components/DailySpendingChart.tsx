"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import type { DailyStat } from "@/types";
import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";
import { useIsDark } from "@/lib/useIsDark";

interface Props {
  data: DailyStat[];
}

export default function DailySpendingChart({ data }: Props) {
  const { hidden } = useHideNumbers();
  const isDark = useIsDark();

  const gridColor     = isDark ? "#374151" : "#f0f0f0";
  const tickColor     = isDark ? "#9ca3af" : "#6b7280";
  const tooltipBg     = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No daily data this month.
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "d MMM"),
  }));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-700 dark:text-gray-200">
        Daily Cash Flow
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} />
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
          <Legend wrapperStyle={{ color: tickColor }} />
          <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="income"  name="Income"  stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
