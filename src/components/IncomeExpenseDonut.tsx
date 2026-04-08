"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardStats } from "@/types";
import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";
import { useIsDark } from "@/lib/useIsDark";

interface Props {
  stats: DashboardStats;
}

export default function IncomeExpenseDonut({ stats }: Props) {
  const { hidden } = useHideNumbers();
  const isDark = useIsDark();

  const tooltipBg     = isDark ? "#1f2937" : "#ffffff";
  const tooltipBorder = isDark ? "#374151" : "#e5e7eb";
  const tooltipText   = isDark ? "#f3f4f6" : "#111827";
  const legendColor   = isDark ? "#9ca3af" : "#6b7280";

  const { totalIncome, totalExpense } = stats;

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No data this month.
      </div>
    );
  }

  const data = [
    { name: "Income",  value: totalIncome  },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-700 dark:text-gray-200">
        Income vs Expense
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            <Cell fill="#10b981" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip
            formatter={hidden ? () => "••••••" : (value) => formatIDR(Number(value))}
            contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipText }}
            itemStyle={{ color: tooltipText }}
          />
          <Legend wrapperStyle={{ color: legendColor }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
