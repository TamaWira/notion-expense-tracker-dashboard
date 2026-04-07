import { Suspense } from "react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { getTransactions } from "@/lib/notion";
import { computeStats, computeCategoryStats, computeDailyStats } from "@/lib/analytics";
import type { Transaction } from "@/types";
import StatCard from "@/components/StatCard";
import SpendingByCategoryChart from "@/components/SpendingByCategoryChart";
import DailySpendingChart from "@/components/DailySpendingChart";
import IncomeExpenseDonut from "@/components/IncomeExpenseDonut";
import TransactionTable from "@/components/TransactionTable";
import FiltersTabletDock from "@/components/FiltersTabletDock";
import FiltersDesktopDock from "@/components/FiltersDesktopDock";

interface PageProps {
  searchParams: Promise<{
    month?: string;
    type?: string;
    category?: string;
  }>;
}

function applyFilters(
  transactions: Transaction[],
  type: string,
  categories: string[]
): Transaction[] {
  return transactions.filter((t) => {
    if (type && type !== "All" && t.type !== type) return false;
    if (categories.length > 0 && !categories.includes(t.category)) return false;
    return true;
  });
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const month = params.month ?? format(new Date(), "yyyy-MM");
  const typeFilter = params.type ?? "All";
  const categoryFilter = params.category
    ? params.category.split(",").filter(Boolean)
    : [];

  const monthDate = parseISO(`${month}-01`);
  const startDate = format(startOfMonth(monthDate), "yyyy-MM-dd");
  const endDate = format(endOfMonth(monthDate), "yyyy-MM-dd");

  const all = await getTransactions(startDate, endDate);
  const transactions = applyFilters(all, typeFilter, categoryFilter);

  const stats = computeStats(transactions);
  const categoryStats = computeCategoryStats(transactions);
  const dailyStats = computeDailyStats(transactions);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile + Tablet: collapsible floating dock (< lg) */}
      <div className="lg:hidden">
        <FiltersTabletDock
          currentMonth={month}
          currentType={typeFilter}
          selectedCategories={categoryFilter}
        />
      </div>

      {/* Desktop: always-expanded bottom dock (lg+) */}
      <div className="hidden lg:block">
        <FiltersDesktopDock
          currentMonth={month}
          currentType={typeFilter}
          selectedCategories={categoryFilter}
        />
      </div>

      {/* Main content
            < lg : pb-28  — clears the collapsible dock
            lg+  : pb-32  — clears the desktop dock (taller when categories shown) */}
      <main className="px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:pb-56">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-400">{startDate} — {endDate}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Income" amount={stats.totalIncome} variant="income" />
            <StatCard label="Total Expense" amount={stats.totalExpense} variant="expense" />
            <StatCard label="Net Balance" amount={stats.netBalance} variant="balance" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SpendingByCategoryChart data={categoryStats} />
            <IncomeExpenseDonut stats={stats} />
          </div>

          {/* Daily line chart */}
          <DailySpendingChart data={dailyStats} />

          {/* Transactions table */}
          <TransactionTable transactions={transactions} />
        </div>
      </main>
    </div>
  );
}
