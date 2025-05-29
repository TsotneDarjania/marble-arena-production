// utils/supabase/actions/getTeams.ts
"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getTeamsFromDatabase() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Teams").select("*");

  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return { success: true, data };
}
