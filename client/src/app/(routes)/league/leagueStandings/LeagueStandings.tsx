"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";

// Simulated 10 weeks of data
const weeksData = [
  // Week 1
  [
    {
      logo: "/images/teams/Roma.png",
      name: "Roma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Inter.png",
      name: "Inter",
      p: 10,
      w: 5,
      d: 2,
      l: 3,
      gf: 15,
      ga: 11,
      gd: 4,
      pts: 17,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rasddqwdoma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rdqoma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rqweoma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rasdasdoma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Roasdasdma",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rowema",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Rom1e2a",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Romqwea",
      p: 10,
      w: 6,
      d: 1,
      l: 3,
      gf: 18,
      ga: 12,
      gd: 6,
      pts: 19,
    },
    // ...add more teams
  ],
  // Week 2
  [
    {
      logo: "/images/teams/Inter.png",
      name: "Inter",
      p: 11,
      w: 6,
      d: 2,
      l: 3,
      gf: 17,
      ga: 12,
      gd: 5,
      pts: 20,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Romaqwe",
      p: 11,
      w: 6,
      d: 1,
      l: 4,
      gf: 19,
      ga: 14,
      gd: 5,
      pts: 19,
    },
    // ...add more teams
  ],

  [
    {
      logo: "/images/teams/Inter.png",
      name: "Inter",
      p: 11,
      w: 6,
      d: 2,
      l: 3,
      gf: 17,
      ga: 12,
      gd: 5,
      pts: 20,
    },
    {
      logo: "/images/teams/Roma.png",
      name: "Romaasd",
      p: 11,
      w: 6,
      d: 1,
      l: 4,
      gf: 19,
      ga: 14,
      gd: 5,
      pts: 19,
    },
    // ...add more teams
  ],
  // ...add week 3-10
];

export default function LeagueStandings() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const totalWeeks = weeksData.length;

  const currentStandings = weeksData[currentWeek - 1];

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
      <div className={styles.weekNav + " text-font"}>
        {currentWeek > 1 && (
          <button
            className={styles.prevBtn}
            onClick={() => setCurrentWeek(currentWeek - 1)}
          >
            ← Previous
          </button>
        )}
        <h3 className={styles.weekTitle + " title-font"}>Week {currentWeek}</h3>
        {currentWeek < totalWeeks && (
          <button
            className={styles.nextBtn}
            onClick={() => setCurrentWeek(currentWeek + 1)}
          >
            Next →
          </button>
        )}
      </div>

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
            <tr key={team.name}>
              <td>{i + 1}</td>
              <td className={styles.teamCell}>
                <Image src={team.logo} alt={team.name} width={30} height={30} />
                <span>{team.name}</span>
              </td>
              <td>{team.p}</td>
              <td>{team.w}</td>
              <td>{team.d}</td>
              <td>{team.l}</td>
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
