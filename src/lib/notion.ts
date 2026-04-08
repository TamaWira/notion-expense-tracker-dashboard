import { unstable_cache } from "next/cache";
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import type { Transaction } from "@/types";

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

function parseTransaction(page: PageObjectResponse): Transaction | null {
  const props = page.properties;

  const nameProp = props["Name"];
  const priceProp = props["Price"];
  const categoryProp = props["Category"];
  const typeProp = props["Type"];
  const dateProp = props["Date"];

  if (
    !nameProp || !priceProp || !categoryProp || !typeProp || !dateProp ||
    nameProp.type !== "title" ||
    priceProp.type !== "number" ||
    categoryProp.type !== "select" ||
    typeProp.type !== "select" ||
    dateProp.type !== "date"
  ) {
    return null;
  }

  const name = nameProp.title[0]?.plain_text ?? "";
  const price = priceProp.number ?? 0;
  const category = categoryProp.select?.name ?? "Uncategorized";
  const rawType = typeProp.select?.name;
  const date = dateProp.date?.start ?? "";

  if (!date || (rawType !== "Income" && rawType !== "Expense")) return null;

  return { id: page.id, name, price, category, type: rawType, date };
}

type FilterCondition = NonNullable<QueryDatabaseParameters["filter"]>;

async function fetchTransactions(
  startDate: string,
  endDate: string,
  type: string,       // "All" | "Income" | "Expense"
  categories: string[] // [] means no category filter
): Promise<Transaction[]> {
  const and: FilterCondition[] = [
    { property: "Date", date: { on_or_after: startDate } },
    { property: "Date", date: { on_or_before: endDate } },
  ];

  if (type !== "All") {
    and.push({ property: "Type", select: { equals: type } });
  }

  if (categories.length === 1) {
    and.push({ property: "Category", select: { equals: categories[0] } });
  } else if (categories.length > 1) {
    and.push({
      or: categories.map((cat) => ({
        property: "Category",
        select: { equals: cat },
      })),
    } as FilterCondition);
  }

  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { and } as QueryDatabaseParameters["filter"],
      sorts: [{ property: "Date", direction: "ascending" }],
      start_cursor: cursor,
      page_size: 100,
    });

    for (const item of response.results) {
      if (item.object === "page" && "properties" in item) {
        results.push(item as PageObjectResponse);
      }
    }

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  return results.map(parseTransaction).filter(Boolean) as Transaction[];
}

// Cached wrapper — keyed by (startDate, endDate, type, categories).
// Each unique filter combination gets its own cache entry, revalidated every 5 minutes.
export const getTransactions = unstable_cache(
  fetchTransactions,
  ["transactions"],
  { revalidate: 300, tags: ["transactions"] }
);
