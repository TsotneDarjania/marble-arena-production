"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getCurrentLeagueWeek(): Promise<{
  success: boolean;
  currentWeek: number | null;
  message?: string;
}> {
  const supabase = await createClient();

  const { data: league, error } = await supabase
    .from("League")
    .select("fixtures")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !league) {
    return {
      success: false,
      currentWeek: null,
      message: error?.message || "No league found",
    };
  }

  const fixtures: any[] = league.fixtures || [];

  // Group fixtures by week
  const weekMap = new Map<number, any[]>();
  for (const fix of fixtures) {
    const week = fix.week;
    if (!weekMap.has(week)) weekMap.set(week, []);
    weekMap.get(week)?.push(fix);
  }

  // Sort weeks in ascending order
  const sortedWeeks = [...weekMap.keys()].sort((a, b) => a - b);

  for (const week of sortedWeeks) {
    const fixturesOfWeek = weekMap.get(week);

    const hasUnplayed = fixturesOfWeek!.some(
      (fix) =>
        typeof fix.homeScore !== "number" || typeof fix.awayScore !== "number"
    );

    if (hasUnplayed) {
      return {
        success: true,
        currentWeek: week,
      };
    }
  }

  // All fixtures are played
  return {
    success: true,
    currentWeek: 9,
    message: "All fixtures completed",
  };
}
