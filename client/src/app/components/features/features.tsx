import styles from "./style.module.css";
import Image from "next/image";

const features = [
  {
    icon: "/images/marble-coin.png", // make sure to add this to your public/icons folder
    title: "Bet with Marble Coins",
    description: "Use Marble Coins to place bets on various matches",
  },
  {
    icon: "/images/calendar.png",
    title: "Weekly Matches",
    description: "Take part in exciting matches that occur every week",
  },
  {
    icon: "/images/stats.png",
    title: "Vote with Marble Coins",
    description:
      "Use your Marble Coins to support your favorite teams. The most-voted teams get promoted to the main league!",
  },
];

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.wrapper}>
        <h2 className={styles.heading + " title-font"}>FEATURES</h2>
        <div className={styles.cards + " text-font"}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                <div className={styles.coinImage}>
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    fill
                    objectFit="contain"
                  />
                </div>
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.description}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
