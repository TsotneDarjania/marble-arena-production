"use server";

import { createClient } from "@/app/utils/supabase/server";
import { StandingEntry } from "./createLeague";

type League = {
  id: number;
  standings: StandingEntry[][]; // standings for each week
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
    .single();

  if (error || !data) {
    return null;
  }

  const league = data as League;

  // ✅ Sort each week's standings and assign position
  if (league.standings.length > 0) {
    league.standings = league.standings.map((week) => {
      const sortedWeek = [...week].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts; // 1. Points
        if (b.gd !== a.gd) return b.gd - a.gd; // 2. Goal Difference
        if (b.gf !== a.gf) return b.gf - a.gf; // 3. Goals For
        return a.teamId - b.teamId; // 4. Fallback
      });

      // Assign position based on sorted order
      return sortedWeek.map((team, index) => ({
        ...team,
        position: index + 1,
      }));
    });
  }

  return league;
}
