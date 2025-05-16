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
            <li className=" text-font" key={i}>
              <div className={styles.iconWrapper}>
                <Image
                  src="/images/feature-logo.png" // Add this to public/icons
                  alt="Checkpoint Icon"
                  width={60}
                  height={60}
                />
              </div>

              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
