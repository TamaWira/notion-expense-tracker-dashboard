"use client";

import { Suspense, useState } from "react";
import { format } from "date-fns";
import HideToggleButton from "@/components/HideToggleButton";
import MonthFilter from "@/components/MonthFilter";
import TypeCategoryFilter from "@/components/TypeCategoryFilter";
import RefreshButton from "@/components/RefreshButton";

interface Props {
  currentMonth: string;
  currentType: string;
  selectedCategories: string[];
}

export default function FiltersTabletDock({
  currentMonth,
  currentType,
  selectedCategories,
}: Props) {
  const [open, setOpen] = useState(false);

  const monthLabel = format(new Date(`${currentMonth}-01`), "MMM yyyy");
  const activeCount =
    (currentType !== "All" ? 1 : 0) + selectedCategories.length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
        {/* Expanded panel */}
        <div
          className={`mb-3 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 ease-in-out ${
            open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-y-auto max-h-[70vh] p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Filters</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Numbers</p>
                <HideToggleButton />
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">Data</p>
                <RefreshButton />
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <Suspense>
                <MonthFilter currentMonth={currentMonth} />
              </Suspense>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <Suspense>
                <TypeCategoryFilter
                  currentType={currentType}
                  selectedCategories={selectedCategories}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Dock bar */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-3 shadow-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
            <FilterIcon />
            <span className="font-medium">Filters</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                {activeCount} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>{monthLabel}</span>
            {currentType !== "All" && (
              <span
                className={`rounded-full px-2 py-0.5 font-medium ${
                  currentType === "Income"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-400"
                }`}
              >
                {currentType}
              </span>
            )}
            <ChevronIcon open={open} />
          </div>
        </button>
      </div>
    </>
  );
}

function FilterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
