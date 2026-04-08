import { Suspense } from "react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { getTransactions } from "@/lib/notion";
import { computeStats, computeCategoryStats, computeDailyStats } from "@/lib/analytics";
import { TRANSACTIONS_PAGE_SIZE } from "@/lib/constants";
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
    page?: string;
  }>;
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

  // Filtering is now done inside the Notion query — no in-memory applyFilters needed
  const filtered = (await getTransactions(startDate, endDate, typeFilter, categoryFilter))
    .sort((a, b) => b.date.localeCompare(a.date));

  // Pagination
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / TRANSACTIONS_PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(1, parseInt(params.page ?? "1", 10)),
    totalPages
  );
  const pageStart = (currentPage - 1) * TRANSACTIONS_PAGE_SIZE;
  const pageTransactions = filtered.slice(pageStart, pageStart + TRANSACTIONS_PAGE_SIZE);

  const stats = computeStats(filtered);
  const categoryStats = computeCategoryStats(filtered);
  const dailyStats = computeDailyStats(filtered);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

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

      <main className="px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:pb-56">
        <div className="mx-auto max-w-5xl space-y-6">

          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Finance Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">{startDate} — {endDate}</p>
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

          {/* Transactions table — pre-sorted, pre-sliced server-side */}
          <TransactionTable
            transactions={pageTransactions}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={TRANSACTIONS_PAGE_SIZE}
          />
        </div>
      </main>
    </div>
  );
}
