import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/lib/notion";
import { computeStats, computeCategoryStats, computeDailyStats } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start or end date" }, { status: 400 });
  }

  try {
    const transactions = await getTransactions(start, end);
    const stats = computeStats(transactions);
    const categoryStats = computeCategoryStats(transactions);
    const dailyStats = computeDailyStats(transactions);

    return NextResponse.json({ transactions, stats, categoryStats, dailyStats });
  } catch (err) {
    console.error("Notion API error:", err);
    return NextResponse.json({ error: "Failed to fetch data from Notion" }, { status: 500 });
  }
}
