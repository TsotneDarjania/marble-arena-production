"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function getFixturesForFrontend() {
  const supabase = await createClient();

  const { data: league, error: leagueError } = await supabase
    .from("League")
    .select("fixtures")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: teams, error: teamsError } = await supabase
    .from("Teams")
    .select("id, name, team_logo_url, fifa_raiting");

  if (leagueError || teamsError) {
    return {
      success: false,
      message: leagueError?.message || teamsError?.message,
    };
  }

  const fixtures = league?.fixtures || [];
  const teamMap = new Map(teams.map((t) => [t.id, t]));
  const groupedData: Record<string, any[]> = {};

  const minRating = 800;
  const maxRating = 2200;
  const base = 1.2;
  const spread = 1.5;

  for (const fix of fixtures) {
    const homeTeam = teamMap.get(fix.homeTeamId);
    const awayTeam = teamMap.get(fix.awayTeamId);

    const homeRating = homeTeam?.fifa_raiting || minRating;
    const awayRating = awayTeam?.fifa_raiting || minRating;

    const homeNorm = (homeRating - minRating) / (maxRating - minRating);
    const awayNorm = (awayRating - minRating) / (maxRating - minRating);

    let homeCoefficient, awayCoefficient;

    if (homeRating > awayRating) {
      homeCoefficient = +(base + spread * (1 - homeNorm)).toFixed(2);
      awayCoefficient = +(base + spread * awayNorm).toFixed(2);
    } else {
      homeCoefficient = +(base + spread * homeNorm).toFixed(2);
      awayCoefficient = +(base + spread * (1 - awayNorm)).toFixed(2);
    }

    // Boosted Draw Coefficient: from 2.2 (close match) to 6.0 (big mismatch)
    const ratingDiff = Math.abs(homeRating - awayRating);
    const maxDiff = maxRating - minRating;
    const diffRatio = ratingDiff / maxDiff;

    const drawCoefficient = +(2.2 + diffRatio * 3.8).toFixed(2);

    const weekKey = `week_${fix.week}`;
    if (!groupedData[weekKey]) groupedData[weekKey] = [];

    groupedData[weekKey].push({
      hosT: {
        id: homeTeam?.id,
        teamName: homeTeam?.name || "Unknown",
        imageSrc: homeTeam?.team_logo_url || "",
        winCoefficient: homeCoefficient,
      },
      guest: {
        id: awayTeam?.id,
        teamName: awayTeam?.name || "Unknown",
        imageSrc: awayTeam?.team_logo_url || "",
        winCoefficient: awayCoefficient,
      },
      drawCoefficient,
      result: fix.result ?? "default",
    });
  }

  return { success: true, data: groupedData };
}
