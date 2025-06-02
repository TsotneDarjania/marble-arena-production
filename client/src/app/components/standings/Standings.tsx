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
  const [week1Standings, setWeek1Standings] = useState<StandingEntry[]>([]);

  useEffect(() => {
    (async () => {
      const league = await getLatestLeagueFromDatabase();

      if (league && Array.isArray(league.standings)) {
        const firstWeek = league.standings[0]; // week 1

        if (Array.isArray(firstWeek)) {
          setWeek1Standings(firstWeek);
        } else {
          console.error("Week 1 standings is not an array");
        }
      } else {
        console.error("Invalid league data");
      }
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
          {week1Standings.map((team, i) => (
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
