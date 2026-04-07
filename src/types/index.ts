export type TransactionType = "Income" | "Expense";

export interface Transaction {
  id: string;
  name: string;
  price: number;
  category: string;
  type: TransactionType;
  date: string; // ISO yyyy-MM-dd
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export interface CategoryStat {
  category: string;
  total: number;
}

export interface DailyStat {
  date: string;
  expense: number;
  income: number;
}
