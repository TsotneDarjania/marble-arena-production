// getUserTickets.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getUserTickets(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Tickets")
    .select(
      `
      option,
      result,
      created_at,
      amount,
      potential_win,
      teams
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, message: error.message, data: null };
  }

  return { success: true, data };
}
