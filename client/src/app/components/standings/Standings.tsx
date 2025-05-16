import Image from "next/image";
import styles from "./style.module.css";

const teams = [
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
    logo: "/images/teams/Juventus.png",
    name: "Juventus",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Bologna.png",
    name: "Bologna",
    p: 10,
    w: 4,
    d: 3,
    l: 3,
    gf: 12,
    ga: 11,
    gd: 1,
    pts: 15,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "dqwed123d12e12e",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "232fwefwfe",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "asfwevgeref23fr2",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "g3rg4",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "saczxcsdqds",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "asdqwdqwd",
    p: 10,
    w: 5,
    d: 1,
    l: 4,
    gf: 14,
    ga: 12,
    gd: 2,
    pts: 16,
  },
];

export default function Standings() {
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
          {teams.map((team, i) => (
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
