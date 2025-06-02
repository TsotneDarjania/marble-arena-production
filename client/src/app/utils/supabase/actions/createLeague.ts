"use server";

import { createClient } from "@/app/utils/supabase/server";

export type TeamInput = {
  id: number;
  name: string;
  logo: string;
};

export type StandingEntry = {
  d: number;
  i: number;
  p: number;
  w: number;
  ga: number;
  gd: number;
  gf: number;
  pts: number;
  teamId: number;
  position: number;
  teamName: string;
  teamLogoUrl: string;
};

function generateRoundRobinFixtures(teamIds: number[]): {
  week: number;
  homeTeamId: number;
  awayTeamId: number;
}[] {
  const fixtures: { week: number; homeTeamId: number; awayTeamId: number }[] =
    [];

  const teams = [...teamIds];
  const numTeams = teams.length;

  if (numTeams % 2 !== 0) {
    teams.push(-1); // dummy team for bye
  }

  const n = teams.length;
  const numWeeks = n - 1;
  const halfSize = n / 2;

  const rotating = teams.slice(1); // exclude fixed team
  for (let round = 0; round < numWeeks; round++) {
    const roundMatches: [number, number][] = [];

    const left = [teams[0], ...rotating.slice(0, halfSize - 1)];
    const right = [...rotating.slice(halfSize - 1)].reverse();

    for (let i = 0; i < halfSize; i++) {
      const t1 = left[i];
      const t2 = right[i];

      if (t1 !== -1 && t2 !== -1) {
        const [home, away] = Math.random() < 0.5 ? [t1, t2] : [t2, t1];
        roundMatches.push([home, away]);
      }
    }

    roundMatches.forEach(([homeTeamId, awayTeamId]) => {
      fixtures.push({ week: round + 1, homeTeamId, awayTeamId });
    });

    // Rotate teams clockwise, fixed team stays
    rotating.unshift(rotating.pop()!);
  }

  return fixtures;
}

export async function saveLeagueWithFixtures(teams: TeamInput[]) {
  const supabase = await createClient();

  // Step 1: Generate week 1 standings
  const standingsWeek1: StandingEntry[] = teams.map((team, index) => ({
    d: 0,
    i: 0,
    p: 0,
    w: 0,
    ga: 0,
    gd: 0,
    gf: 0,
    pts: 0,
    teamId: team.id,
    position: index + 1,
    teamName: team.name,
    teamLogoUrl: team.logo,
  }));

  const standings: StandingEntry[] = standingsWeek1;

  // Step 2: Generate perfect round-robin fixtures
  const teamIds = teams.map((t) => t.id);
  const fixtures = generateRoundRobinFixtures(teamIds);

  // Step 3: Insert into Leagues table
  const { error } = await supabase.from("League").insert([
    {
      standings: [standings],
      fixtures,
      week: 1,
    },
  ]);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
