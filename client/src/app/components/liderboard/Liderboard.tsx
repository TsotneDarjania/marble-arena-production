"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { useAppContext } from "@/app/context/AppContexty";
import { getLeaderboard } from "@/app/utils/supabase/actions/getLiderboard";

type User = {
  id: string;
  username: string;
  profile_image_url: string;
  total_won: number;
};

type CurrentUserData = {
  rank: number;
  user: User;
};

export default function Leaderboard() {
  const { user } = useAppContext();
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      const result = await getLeaderboard(user.id);
      console.log(result);
      if (!result.success) {
        setError("Failed to load leaderboard");
      } else {
        setTopUsers(result.topUsers!);
        setCurrentUser(result.currentUser!);
      }
    }

    fetchData();
  }, [user?.id]);

  if (error) return <p>{error}</p>;

  return (
    <section className={styles.leaderboard}>
      <h2 className={styles.title + " title-font"}>🏆LEADERBOARD</h2>

      <div className={styles.list}>
        {topUsers.map((user, index) => (
          <div key={user.id} className={styles.card + " text-font"}>
            <div className="flex gap-2">
              <div className={styles.rank}>#{index + 1}</div>
              <div className={styles.userProfileImage}>
                <Image
                  alt={user.username}
                  src={user.profile_image_url}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.username}>{user.username}</div>
            </div>

            <div className={styles.coinBadge}>
              <div className={styles.coinImage}>
                <Image
                  src="/images/ticket-done-icon.png"
                  alt="Marble Coin"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span>{user.total_won}</span>
            </div>
          </div>
        ))}
      </div>

      {currentUser && (
        <div className={styles.currentUser + " text-font"}>
          Your Rank: <strong>#{currentUser.rank}</strong> -{" "}
          {currentUser.user.username} -{" "}
          <div className={styles.coinImage}>
            <Image
              src="/images/ticket-done-icon.png"
              alt="Marble Coin"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          {currentUser.user.total_won}
        </div>
      )}
    </section>
  );
}
