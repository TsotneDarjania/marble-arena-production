"use server";

import { createClient } from "@/app/utils/supabase/server";
import { StandingEntry } from "./createLeague";

type League = {
  id: number;
  standings: StandingEntry[];
  fixtures: { week: number; homeTeamId: number; awayTeamId: number }[];
  week: number;
  created_at: string;
};

export async function getLatestLeagueFromDatabase(): Promise<League | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("League")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single(); // Automatically returns a single object instead of an array

  if (error || !data) {
    return null;
  }

  return data as League;
}
