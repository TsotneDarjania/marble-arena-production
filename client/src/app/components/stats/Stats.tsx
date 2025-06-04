"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { getTotalUsers } from "@/app/utils/supabase/actions/getTotalUsers";

export default function Stats() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUserCount() {
      const result = await getTotalUsers();
      if (result.success) {
        setUserCount(result.count);
      } else {
        console.error("Failed to fetch user count:", result.message);
      }
    }

    fetchUserCount();
  }, []);

  return (
    <section className={styles.statsSection}>
      <div className={styles.content}>
        <h2 className={styles.heading + " title-font"}>STATS</h2>

        <div className={styles.statsGrid}>
          <div className={styles.statItem + " text-font"}>
            <div className={styles.iconWrapper}>
              <Image
                src="/images/youtube.png"
                alt="YouTube"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.textContent}>
              <p className={styles.value}>100K</p>
              <p className={styles.label}>YouTube Subscribers</p>
            </div>
          </div>

          <div className={styles.statItem + " text-font"}>
            <div className={styles.iconWrapper}>
              <Image
                src="/images/user.png"
                alt="Users"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className={styles.textContent}>
              <p className={styles.value}>
                {userCount !== null ? userCount.toLocaleString() : "..."}
              </p>
              <p className={styles.label}>Registered Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
