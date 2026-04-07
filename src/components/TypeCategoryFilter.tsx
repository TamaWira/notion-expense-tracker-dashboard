"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { TransactionType } from "@/types";

interface Props {
  currentType: string;
  selectedCategories: string[]; // empty = all
}

const TYPES = ["All", "Income", "Expense"] as const;

export default function TypeCategoryFilter({ currentType, selectedCategories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    <div className="flex flex-col gap-4">
      {/* Type */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</p>
        <div className="flex gap-1.5 flex-wrap">
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

      {/* Category checkboxes */}
      {categories && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => {
              const checked = selectedCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300 select-none"
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
          {selectedCategories.length > 0 && (
            <button
              onClick={clearCategories}
              className="mt-1 self-start text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}
