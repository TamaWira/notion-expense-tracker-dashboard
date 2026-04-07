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

interface Props {
  data: DailyStat[];
}

export default function DailySpendingChart({ data }: Props) {
  const { hidden } = useHideNumbers();

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center justify-center h-48 text-gray-400 text-sm">
        No daily data this month.
      </div>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "d MMM"),
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-700">Daily Cash Flow</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis
            tickFormatter={hidden ? () => "••••" : (v) => `${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11 }}
            width={56}
          />
          <Tooltip formatter={hidden ? () => "••••••" : (value) => formatIDR(Number(value))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="expense"
            name="Expense"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
