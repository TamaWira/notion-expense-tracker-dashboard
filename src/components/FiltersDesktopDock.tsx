"use client";

import { Suspense } from "react";
import { format, subMonths, addMonths } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { TransactionType } from "@/types";
import { useHideNumbers } from "@/context/HideNumbersContext";

interface Props {
  currentMonth: string;
  currentType: string;
  selectedCategories: string[];
}

const TYPES = ["All", "Income", "Expense"] as const;

export default function FiltersDesktopDock(props: Props) {
  return (
    <Suspense>
      <DockInner {...props} />
    </Suspense>
  );
}

function DockInner({ currentMonth, currentType, selectedCategories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hidden, toggle } = useHideNumbers();

  const current = new Date(`${currentMonth}-01`);
  const prev = format(subMonths(current, 1), "yyyy-MM");
  const next = format(addMonths(current, 1), "yyyy-MM");
  const monthLabel = format(current, "MMMM yyyy");

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key); else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  function setType(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "All") params.delete("type"); else params.set("type", type);
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    if (next.length === 0) params.delete("category");
    else params.set("category", next.join(","));
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearCategories() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
  }

  const categories =
    currentType === "Income" || currentType === "Expense"
      ? CATEGORIES[currentType as TransactionType]
      : null;

  const accentChecked =
    currentType === "Income" ? "accent-emerald-500" : "accent-rose-500";

  return (
    <div className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
      <div className="flex w-max items-start gap-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4 shadow-xl">

        {/* Numbers */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Numbers</p>
          <button
            onClick={toggle}
            title={hidden ? "Show numbers" : "Hide numbers"}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {hidden ? <EyeIcon /> : <EyeOffIcon />}
            {hidden ? "Show" : "Hide"}
          </button>
        </div>

        <div className="w-px self-stretch bg-gray-100 dark:bg-gray-800 shrink-0" />

        {/* Month */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Month</p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigate("month", prev)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 min-w-[100px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={() => navigate("month", next)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              →
            </button>
            <input
              type="month"
              value={currentMonth}
              onChange={(e) => navigate("month", e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="w-px self-stretch bg-gray-100 dark:bg-gray-800 shrink-0" />

        {/* Type */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
          <div className="flex gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  currentType === t
                    ? t === "Income"
                      ? "bg-emerald-500 text-white"
                      : t === "Expense"
                      ? "bg-rose-500 text-white"
                      : "bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        {categories && (
          <>
            <div className="w-px self-stretch bg-gray-100 dark:bg-gray-800 shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearCategories}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-x-6 gap-y-1.5">
                {categories.map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat)}
                        className={`h-3.5 w-3.5 rounded ${accentChecked}`}
                      />
                      {cat}
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
