"use client";

import { format, parseISO } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Transaction } from "@/types";
import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";

interface Props {
  transactions: Transaction[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export default function TransactionTable({
  transactions,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
}: Props) {
  const { hidden } = useHideNumbers();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalCount);

  if (totalCount === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm text-center text-sm text-gray-400 dark:text-gray-500">
        No transactions this month.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Transactions</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {rangeStart}–{rangeEnd} of {totalCount}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {format(parseISO(t.date), "d MMM yyyy")}
                </td>
                <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{t.name}</td>
                <td className="px-5 py-3">
                  <span className="inline-block rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                    {t.category}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    t.type === "Income"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-400"
                  }`}>
                    {t.type}
                  </span>
                </td>
                <td className={`px-5 py-3 text-right font-medium ${
                  t.type === "Income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}>
                  {hidden ? "••••••" : `${t.type === "Expense" ? "−" : "+"}${formatIDR(t.price)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-5 py-3">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="flex items-center gap-1">
            {buildPageNumbers(currentPage, totalPages).map((item, i) =>
              item === "…" ? (
                <span key={`ellipsis-${i}`} className="px-1 text-sm text-gray-400 dark:text-gray-500">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => goToPage(item as number)}
                  className={`min-w-[32px] rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                    item === currentPage
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

/** Returns page numbers with "…" gaps, e.g. [1, "…", 4, 5, 6, "…", 12] */
function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [];
  const addPage = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  const addEllipsis = () => { if (pages[pages.length - 1] !== "…") pages.push("…"); };

  addPage(1);
  if (current > 3) addEllipsis();
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) addPage(p);
  if (current < total - 2) addEllipsis();
  addPage(total);

  return pages;
}
