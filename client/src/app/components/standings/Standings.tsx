"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { getLatestLeagueFromDatabase } from "@/app/utils/supabase/actions/getLeagueFromDatabase";
import { getCurrentLeagueWeek } from "@/app/utils/supabase/actions/getCurrentLeagueWeek";

type StandingEntry = {
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

export default function Standings() {
  const [weekStandings, setWeekStandings] = useState<StandingEntry[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getCurrentLeagueWeek();
      console.log(res);

      if (!res.success || res.currentWeek === null) {
        console.error("Failed to get current week");
        return;
      }

      const current = res.currentWeek;
      setCurrentWeek(current);

      const league = await getLatestLeagueFromDatabase();
      if (!league || !Array.isArray(league.standings)) {
        console.error("Invalid league data");
        return;
      }

      const latestWeekStandings = league.standings[current - 1];
      if (!Array.isArray(latestWeekStandings)) {
        console.error("Latest standings is not an array");
        return;
      }

      setWeekStandings(latestWeekStandings);
    })();
  }, []);

  return (
    <div className={styles.standings}>
      <div className={styles.leagueLogo}>
        <Image
          alt="League Logo"
          src="/images/marble-league-logo.png"
          fill
          objectFit="contain"
        />
      </div>

      <h2 className={styles.title + " title-font"}>LEAGUE STANDINGS</h2>

      <table className={styles.table + " text-font"}>
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {weekStandings.map((team, i) => (
            <tr key={team.teamId}>
              <td>{i + 1}</td>
              <td className={styles.teamCell}>
                <Image
                  src={team.teamLogoUrl}
                  alt={team.teamName}
                  width={30}
                  height={30}
                />
                <span>{team.teamName}</span>
              </td>
              <td>{team.p}</td>
              <td>{team.w}</td>
              <td>{team.d}</td>
              <td>{team.i}</td>
              <td>{team.gf}</td>
              <td>{team.ga}</td>
              <td>{team.gd}</td>
              <td>{team.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
