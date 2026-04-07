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
    if (type === "All") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("category"); // reset categories on type change
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];

    if (next.length === 0) {
      params.delete("category");
    } else {
      params.set("category", next.join(","));
    }
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
    <div className="flex flex-col gap-3">
      {/* Type pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 w-16 shrink-0">Type</span>
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
                    : "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Category checkboxes — only shown when Income or Expense is selected */}
      {categories && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 w-16 shrink-0 pt-0.5">
            Category
          </span>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {categories.map((cat) => {
                const checked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700 select-none"
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
                className="mt-0.5 self-start text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
