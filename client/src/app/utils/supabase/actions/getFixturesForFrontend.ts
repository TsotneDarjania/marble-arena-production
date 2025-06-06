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
  const maxRating = 2400;

  const minCoef = 1.1;
  const maxCoef = 20.0;
  const curveFactor = 3.5; // HIGHER = more exaggeration

  for (const fix of fixtures) {
    const homeTeam = teamMap.get(fix.homeTeamId);
    const awayTeam = teamMap.get(fix.awayTeamId);

    const homeRating = homeTeam?.fifa_raiting || minRating;
    const awayRating = awayTeam?.fifa_raiting || minRating;

    const total = homeRating + awayRating;
    const homeStrength = homeRating / total;
    const awayStrength = awayRating / total;

    // Coefficients using exponential shaping
    const homeCoefficient = +(
      minCoef +
      (maxCoef - minCoef) * Math.pow(1 - homeStrength, curveFactor)
    ).toFixed(2);

    const awayCoefficient = +(
      minCoef +
      (maxCoef - minCoef) * Math.pow(1 - awayStrength, curveFactor)
    ).toFixed(2);

    // Draw coefficient — based on how close the teams are
    const ratingDiff = Math.abs(homeRating - awayRating);
    const maxDiff = maxRating - minRating;
    const drawBase = 2.5;
    const drawCoefficient = +(
      drawBase +
      (1 - ratingDiff / maxDiff) * 2.0
    ).toFixed(2); // closer teams → higher draw chance

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
