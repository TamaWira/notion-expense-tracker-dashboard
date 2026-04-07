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
import MonthFilter from "@/components/MonthFilter";
import TypeCategoryFilter from "@/components/TypeCategoryFilter";
import HideToggleButton from "@/components/HideToggleButton";

interface PageProps {
  searchParams: Promise<{
    month?: string;
    type?: string;
    category?: string; // comma-separated, e.g. "Food,Coffee"
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
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {startDate} — {endDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <HideToggleButton />
            <Suspense>
              <MonthFilter currentMonth={month} />
            </Suspense>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <Suspense>
            <TypeCategoryFilter
              currentType={typeFilter}
              selectedCategories={categoryFilter}
            />
          </Suspense>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Income" amount={stats.totalIncome} variant="income" />
          <StatCard label="Total Expense" amount={stats.totalExpense} variant="expense" />
          <StatCard label="Net Balance" amount={stats.netBalance} variant="balance" />
        </div>

        {/* Charts row */}
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
  );
}
