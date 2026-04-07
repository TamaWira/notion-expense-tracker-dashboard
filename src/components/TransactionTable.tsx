"use client";

import { format, parseISO } from "date-fns";
import type { Transaction } from "@/types";
import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  const { hidden } = useHideNumbers();

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm text-center text-sm text-gray-400 dark:text-gray-500">
        No transactions this month.
      </div>
    );
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">Transactions</h2>
      </div>
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
            {sorted.map((t) => (
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
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      t.type === "Income"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-400"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-5 py-3 text-right font-medium ${
                    t.type === "Income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {hidden ? "••••••" : `${t.type === "Expense" ? "−" : "+"}${formatIDR(t.price)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
