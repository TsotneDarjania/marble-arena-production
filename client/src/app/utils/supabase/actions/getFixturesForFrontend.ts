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
  const spread = 2.0;

  for (const fix of fixtures) {
    const homeTeam = teamMap.get(fix.homeTeamId);
    const awayTeam = teamMap.get(fix.awayTeamId);

    const homeRating = homeTeam?.fifa_raiting || minRating;
    const awayRating = awayTeam?.fifa_raiting || minRating;

    const totalRating = homeRating + awayRating || 1;
    const homeStrength = homeRating / totalRating;
    const awayStrength = awayRating / totalRating;

    const homeCoefficient = +(base + (1 - homeStrength) * spread).toFixed(2);
    const awayCoefficient = +(base + (1 - awayStrength) * spread).toFixed(2);

    const ratingDiff = Math.abs(homeRating - awayRating);
    const maxDiff = maxRating - minRating;
    const diffRatio = ratingDiff / maxDiff;
    const drawCoefficient = +(1.5 + diffRatio * 2.0).toFixed(2);

    const weekKey = `week_${fix.week}`;
    if (!groupedData[weekKey]) groupedData[weekKey] = [];

    groupedData[weekKey].push({
      host: {
        id: homeTeam?.id,
        teamName: homeTeam?.name || "Unknown",
        imageSrc: homeTeam?.team_logo_url || "",
        winCoefficient: homeCoefficient,
        score: typeof fix.homeScore === "number" ? fix.homeScore : null,
      },
      guest: {
        id: awayTeam?.id,
        teamName: awayTeam?.name || "Unknown",
        imageSrc: awayTeam?.team_logo_url || "",
        winCoefficient: awayCoefficient,
        score: typeof fix.awayScore === "number" ? fix.awayScore : null,
      },
      drawCoefficient,
    });
  }

  return { success: true, data: groupedData };
}
