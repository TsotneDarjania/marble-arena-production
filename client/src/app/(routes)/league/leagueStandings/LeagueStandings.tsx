"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { getLatestLeagueFromDatabase } from "@/app/utils/supabase/actions/getLeagueFromDatabase";

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
  const [standingsHistory, setStandingsHistory] = useState<StandingEntry[][]>(
    []
  );
  const [currentWeek, setCurrentWeek] = useState(1);
  const [maxWeek, setMaxWeek] = useState(0);

  useEffect(() => {
    (async () => {
      const latestLeague = await getLatestLeagueFromDatabase();

      if (latestLeague?.standings) {
        const fixedStandings: StandingEntry[][] = Array.isArray(
          latestLeague.standings[0]
        )
          ? (latestLeague.standings as unknown as StandingEntry[][])
          : [latestLeague.standings as unknown as StandingEntry[]];

        setStandingsHistory(fixedStandings);
        setCurrentWeek(latestLeague.week);
        setMaxWeek(latestLeague.standings.length);
      }
    })();
  }, []);

  const currentStandings = standingsHistory[currentWeek - 1] || [];

  return (
    <div className={styles.standings}>
      <div className={styles.leagueLogo}>
        <Image
          alt="League Logo"
          src="/images/marble-league-logo.png"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>

      <h2 className={styles.title + " title-font"}>LEAGUE STANDINGS</h2>

      <div className={styles.weekNav}>
        <h3 className={styles.weekTitle + " title-font"}>Week {currentWeek}</h3>
        <div className={styles.weekButtons}>
          <div className={styles.buttonWrapper}>
            {currentWeek > 1 && (
              <button
                className={styles.prevBtn}
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                ← Previous
              </button>
            )}
          </div>
          <div className={styles.buttonWrapper + " " + styles.right}>
            {currentWeek < maxWeek && (
              <button
                className={styles.nextBtn}
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
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
            {currentStandings.map((team, i) => (
              <tr key={team.teamId}>
                <td>{i + 1}</td>
                <td className={styles.teamCell}>
                  <Image
                    src={team.teamLogoUrl}
                    alt={team.teamName}
                    width={30}
                    height={30}
                  />
                  <span className={styles.teamName} title={team.teamName}>
                    {team.teamName}
                  </span>
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
    </div>
  );
}
