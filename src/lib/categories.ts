import type { TransactionType } from "@/types";

export const CATEGORY_ICONS: Record<string, string> = {
  // Income
  Salary: "💼",
  Freelance: "💻",
  Bonus: "🎉",
  Investment: "📈",
  Gift: "🎁",
  // Expense
  Food: "🍽️",
  Snack: "🍿",
  "Coffee n Drink": "☕",
  "Coffee n Drinks": "☕",
  Transport: "🚌",
  Bill: "🧾",
  Utility: "⚡",
  "Self-Care": "🪥",
  Laundry: "👕",
  Fruit: "🍎",
  Household: "🏠",
  Shopping: "🛍️",
  Date: "🌹",
  // Shared
  Other: "📦",
};

export const CATEGORIES: Record<TransactionType, string[]> = {
  Income: ["Salary", "Freelance", "Bonus", "Investment", "Gift", "Other"],
  Expense: [
    "Food",
    "Snack",
    "Coffee n Drinks",
    "Transport",
    "Bill",
    "Utility",
    "Self-Care",
    "Laundry",
    "Fruit",
    "Household",
    "Shopping",
    "Date",
    "Other",
  ],
};
