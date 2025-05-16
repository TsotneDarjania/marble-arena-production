import Image from "next/image";
import styles from "./style.module.css";

const leaderboard = [
  { name: "Alice", coins: 1250 },
  { name: "Bob", coins: 1200 },
  { name: "Charlie", coins: 1100 },
  { name: "David", coins: 1000 },
  { name: "Eve", coins: 950 },
  { name: "Frank", coins: 850 },
  { name: "Grace", coins: 800 },
  { name: "Hannah", coins: 750 },
  { name: "Isaac", coins: 700 },
  { name: "Jack", coins: 680 },
];

const currentUser = {
  rank: 34,
  name: "Tsoten Darjania",
  coins: 290,
};

export default function Leaderboard() {
  return (
    <section className={styles.leaderboard}>
      <h2 className={styles.title + " title-font"}>🏆LEADERBOARD</h2>

      <div className={styles.list}>
        {leaderboard.map((user, index) => (
          <div key={user.name} className={styles.card + " text-font"}>
            <div className={styles.rank}>#{index + 1}</div>
            <div className={styles.userProfileImage}>
              <Image
                alt="Marble Coin Icon"
                src="/images/user-profile.png"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.username}>{user.name}</div>
            <div className={styles.coinBadge}>
              <div className={styles.coinImage}>
                <Image
                  src="/images/marble-coin.png"
                  alt="Marble Coin"
                  fill
                  objectFit="contain"
                />
              </div>

              <span>{user.coins}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.currentUser + " text-font"}>
        Your Rank: <strong>#{currentUser.rank}</strong> - {currentUser.name} -{" "}
        <div className={styles.coinImage}>
          <Image
            src="/images/marble-coin.png"
            alt="Marble Coin"
            fill
            objectFit="contain"
          />
        </div>
        {currentUser.coins}
      </div>
    </section>
  );
}
