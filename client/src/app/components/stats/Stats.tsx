import styles from "./style.module.css";
import Image from "next/image";

export default function Stats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.content}>
        <h2 className={styles.heading + " title-font"}>STATS</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statItem + " text-font"}>
            <div className={styles.youtubeLogo}>
              <Image
                src="/images/youtube.png" // Place in public/icons/
                alt="YouTube"
                fill
                objectFit="contain"
              />
            </div>
            <div className={styles.textContent}>
              <p className={styles.value}>100K</p>
              <p className={styles.label}>YouTube Subscribers</p>
            </div>
          </div>

          <div className={styles.statItem + " text-font"}>
            <div className={styles.userLogo + " mt-[14px]"}>
              <Image
                src="/images/user.png" // Place in public/icons/
                alt="YouTube"
                fill
                objectFit="contain"
              />
            </div>
            <div>
              <p className={styles.value}>12,000</p>
              <p className={styles.label}>Registered Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
