"use server";

import { revalidateTag } from "next/cache";

export async function revalidateTransactions() {
  revalidateTag("transactions", {});
}
