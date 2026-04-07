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
    router.push(`${pathname}?${params.toString()}`);
  }

  const current = new Date(`${currentMonth}-01`);
  const prev = format(subMonths(current, 1), "yyyy-MM");
  const next = format(addMonths(current, 1), "yyyy-MM");
  const label = format(current, "MMMM yyyy");

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(prev)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        ← Prev
      </button>
      <span className="text-lg font-semibold text-gray-800 min-w-[140px] text-center">
        {label}
      </span>
      <button
        onClick={() => navigate(next)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        Next →
      </button>
      <input
        type="month"
        value={currentMonth}
        onChange={(e) => navigate(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
