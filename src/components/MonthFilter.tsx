"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, subMonths, addMonths } from "date-fns";

interface MonthFilterProps {
  currentMonth: string; // "yyyy-MM"
}

export default function MonthFilter({ currentMonth }: MonthFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(month: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const current = new Date(`${currentMonth}-01`);
  const prev = format(subMonths(current, 1), "yyyy-MM");
  const next = format(addMonths(current, 1), "yyyy-MM");
  const label = format(current, "MMMM yyyy");

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Month</p>
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate(prev)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ←
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">
          {label}
        </span>
        <button
          onClick={() => navigate(next)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          →
        </button>
      </div>
      <input
        type="month"
        value={currentMonth}
        onChange={(e) => navigate(e.target.value)}
        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
