"use server";

import { PromotionTeamType } from "@/app/components/adminComponents/addPromotionTeamsWindow/AddPromotionTeamsWindow";
import { createClient } from "@/app/utils/supabase/server";

export async function getPromotionTeamsFromDatabase(): Promise<
  PromotionTeamType[] | null
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("PromotionTeams")
    .select("*")
    .order("voted_coins", { ascending: false }); // ✅ sort descending

  if (error) {
    console.error("Failed to fetch promotion teams:", error.message);
    return null;
  }

  return data as PromotionTeamType[];
}
