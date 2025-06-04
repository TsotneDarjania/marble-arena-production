"use server";

import { createClient } from "../server";

export async function getTotalUsers() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("Users")
    .select("*", { count: "exact", head: true });

  if (error) {
    return { success: false, message: error.message, count: 0 };
  }

  return { success: true, count: count ?? 0 };
}
