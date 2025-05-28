import styles from "./style.module.css";
import Image from "next/image";

type Winner = {
  logo: string;
  name: string;
  titles: number;
};

const winners: Winner[] = [
  {
    logo: "/images/teams/Roma.png",
    name: "Roma",
    titles: 9,
  },
  {
    logo: "/images/teams/Inter.png",
    name: "Inter",
    titles: 7,
  },
  {
    logo: "/images/teams/Juventus.png",
    name: "Juventus",
    titles: 3,
  },
  {
    logo: "/images/teams/Bologna.png",
    name: "Bologna",
    titles: 1,
  },
];

export default function MarbleLeagueWinners() {
  return (
    <section className={styles.winnersSection}>
      <h2 className={"title-font " + styles.heading}>MARBLE LEAGUE WINNERS</h2>
      <ul className={styles.list}>
        {winners.map((team) => (
          <li key={team.name} className={styles.item + " text-font"}>
            <div className={styles.logo}>
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                objectFit="contain"
                fill
              />
            </div>
            <span className={styles.name}>{team.name}</span>
            <div className={styles.initials}>
              <div className={styles.leagueLogo}>
                <Image
                  src={"/images/marble-league-logo.png"}
                  alt={`${team.name} logo`}
                  objectFit="contain"
                  fill
                />
              </div>
              <span className={styles.titles}>{team.titles}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
