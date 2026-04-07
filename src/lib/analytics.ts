import type { Transaction, CategoryStat, DailyStat, DashboardStats } from "@/types";

export function computeStats(transactions: Transaction[]): DashboardStats {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === "Income") totalIncome += t.price;
    else totalExpense += t.price;
  }

  return { totalIncome, totalExpense, netBalance: totalIncome - totalExpense };
}

export function computeCategoryStats(transactions: Transaction[]): CategoryStat[] {
  const map = new Map<string, number>();

  for (const t of transactions) {
    if (t.type === "Expense") {
      map.set(t.category, (map.get(t.category) ?? 0) + t.price);
    }
  }

  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function computeDailyStats(transactions: Transaction[]): DailyStat[] {
  const map = new Map<string, { expense: number; income: number }>();

  for (const t of transactions) {
    const entry = map.get(t.date) ?? { expense: 0, income: 0 };
    if (t.type === "Expense") entry.expense += t.price;
    else entry.income += t.price;
    map.set(t.date, entry);
  }

  return Array.from(map.entries())
    .map(([date, { expense, income }]) => ({ date, expense, income }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
