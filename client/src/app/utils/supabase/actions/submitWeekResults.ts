"use server";

import { createClient } from "@/app/utils/supabase/server";

export async function submitWeekResults({
  week,
  results,
}: {
  week: number;
  results: Record<string, { hostScore: string; guestScore: string }>;
}) {
  const supabase = await createClient();

  const { data: league, error: leagueError } = await supabase
    .from("League")
    .select("id, standings, week, fixtures")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (leagueError || !league) {
    return {
      success: false,
      message: leagueError?.message || "League not found",
    };
  }

  const standings = [...league.standings];
  const weekIndex = week - 1;
  const updatedWeek = standings[weekIndex].map((team: any) => ({ ...team }));

  const teamIdToName = new Map<number, string>();
  updatedWeek.forEach((team: any) => {
    teamIdToName.set(team.teamId, team.teamName);
  });

  for (const key in results) {
    const [hostIdStr, guestIdStr] = key.split("_");
    const hostId = Number(hostIdStr);
    const guestId = Number(guestIdStr);
    const hostScore = Number(results[key].hostScore);
    const guestScore = Number(results[key].guestScore);

    const hostTeam = updatedWeek.find((t: any) => t.teamId === hostId);
    const guestTeam = updatedWeek.find((t: any) => t.teamId === guestId);

    if (!hostTeam || !guestTeam) continue;

    hostTeam.p += 1;
    guestTeam.p += 1;

    hostTeam.gf += hostScore;
    hostTeam.ga += guestScore;
    guestTeam.gf += guestScore;
    guestTeam.ga += hostScore;

    hostTeam.gd = hostTeam.gf - hostTeam.ga;
    guestTeam.gd = guestTeam.gf - guestTeam.ga;

    if (hostScore > guestScore) {
      hostTeam.w += 1;
      hostTeam.pts += 3;
      guestTeam.i += 1;
    } else if (guestScore > hostScore) {
      guestTeam.w += 1;
      guestTeam.pts += 3;
      hostTeam.i += 1;
    } else {
      hostTeam.d += 1;
      guestTeam.d += 1;
      hostTeam.pts += 1;
      guestTeam.pts += 1;
    }
  }

  standings[weekIndex] = updatedWeek;

  const nextWeek = updatedWeek
    .map((team: any) => ({ ...team }))
    .sort((a: any, b: any) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  nextWeek.forEach((team: any, index: number) => {
    team.position = index + 1;
  });

  standings.push(nextWeek);

  const updatedFixtures = league.fixtures.map((fix: any) => {
    if (fix.week !== week) return fix;

    const key = `${fix.homeTeamId}_${fix.awayTeamId}`;
    const result = results[key];

    if (!result) return fix;

    return {
      ...fix,
      homeScore: Number(result.hostScore),
      awayScore: Number(result.guestScore),
    };
  });

  const { error: updateError } = await supabase
    .from("League")
    .update({
      standings,
      fixtures: updatedFixtures,
      week: week + 1,
    })
    .eq("id", league.id);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  for (const key in results) {
    const [hostIdStr, guestIdStr] = key.split("_");
    const hostId = Number(hostIdStr);
    const guestId = Number(guestIdStr);

    const hostName = teamIdToName.get(hostId);
    const guestName = teamIdToName.get(guestId);
    if (!hostName || !guestName) continue;

    const hostScore = Number(results[key].hostScore);
    const guestScore = Number(results[key].guestScore);
    const resultValue = `${hostScore}-${guestScore}`;

    const { error: ticketError } = await supabase
      .from("Tickets")
      .update({ result: resultValue })
      .eq("week", week)
      .eq("teams->>host", hostName)
      .eq("teams->>guest", guestName);

    if (ticketError) {
      console.error(
        `❌ Failed to update ticket for ${hostName} vs ${guestName}:`,
        ticketError.message
      );
    }
  }

  const { data: weekTickets, error: fetchError } = await supabase
    .from("Tickets")
    .select("user_id, option, result, potential_win")
    .eq("week", week);

  if (!fetchError && weekTickets) {
    const userStats = new Map<
      string,
      { won: number; lost: number; profit: number }
    >();

    for (const ticket of weekTickets) {
      const { user_id, option, result, potential_win } = ticket;
      if (!user_id || !option || !result) continue;

      const [h, g] = result.split("-").map(Number);
      let actual: "host" | "draw" | "guest" = "draw";
      if (h > g) actual = "host";
      else if (g > h) actual = "guest";

      const correct = actual === option;
      if (!userStats.has(user_id)) {
        userStats.set(user_id, { won: 0, lost: 0, profit: 0 });
      }
      const stat = userStats.get(user_id)!;
      if (correct) {
        stat.won++;
        stat.profit += potential_win || 0;
      } else {
        stat.lost++;
      }
    }

    for (const [userId, stat] of userStats) {
      const { data: existing, error: userError } = await supabase
        .from("Users")
        .select("total_won, total_loss, balance")
        .eq("id", userId)
        .single();

      if (userError || !existing) continue;

      const { total_won = 0, total_loss = 0, balance = 0 } = existing;

      await supabase
        .from("Users")
        .update({
          total_won: total_won + stat.won,
          total_loss: total_loss + stat.lost,
          balance: balance + stat.profit,
        })
        .eq("id", userId);
    }
  }

  return { success: true };
}
