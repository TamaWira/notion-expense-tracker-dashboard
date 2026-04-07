import type { TransactionType } from "@/types";

export const CATEGORIES: Record<TransactionType, string[]> = {
  Income: ["Salary", "Freelance", "Bonus", "Investment", "Gift", "Other"],
  Expense: [
    "Food", "Snack", "Coffee", "Transport", "Bill", "Utility",
    "Self-Care", "Laundry", "Fruit", "Household", "Shopping", "Other",
  ],
};
