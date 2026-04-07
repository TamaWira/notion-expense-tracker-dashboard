"use client";

import { formatIDR } from "@/lib/format";
import { useHideNumbers } from "@/context/HideNumbersContext";

interface StatCardProps {
  label: string;
  amount: number;
  variant: "income" | "expense" | "balance";
}

const variantStyles = {
  income: "border-emerald-500 bg-emerald-50 text-emerald-700",
  expense: "border-rose-500 bg-rose-50 text-rose-700",
  balance: "border-blue-500 bg-blue-50 text-blue-700",
};

export default function StatCard({ label, amount, variant }: StatCardProps) {
  const { hidden } = useHideNumbers();

  return (
    <div className={`rounded-xl border-l-4 p-5 shadow-sm ${variantStyles[variant]}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {hidden ? "••••••" : formatIDR(amount)}
      </p>
    </div>
  );
}
