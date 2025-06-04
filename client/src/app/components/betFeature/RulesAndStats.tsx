import styles from "./style.module.css";
import Image from "next/image";

const checkpoints = [
  "Place bets using Marble Coins",
  "Fill out tickets and view your ticket history",
  "Get a prize for having more than 1000 Marble Coins",
  "Spend coins to improve your favorite team",
  "Participate in league matches",
];

export default function BettingFeature() {
  return (
    <section className={styles.bettingSection}>
      <h2 className={styles.heading + " title-font"}>PLACE A BET</h2>
      <div className={styles.content}>
        <ul className={styles.checkpoints}>
          {checkpoints.map((item, i) => (
            <li className={styles.checkpointItem + " text-font"} key={i}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/images/feature-logo.png"
                  alt="Checkpoint Icon"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
