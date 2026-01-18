import Image from "next/image";
import styles from "./style.module.css";
import { getLeaderboard } from "@/app/utils/supabase/actions/getLiderboard";
import { UserType } from "@/app/types/userTypes";
import { getUserData } from "@/app/utils/supabase/actions/getUserData";

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

type LeaderboardProps = {
  user: UserType;
};

export default async function Leaderboard() {

  const user = await getUserData()

  if (!user?.id) return null;

  const result = await getLeaderboard(user.id);

  if (!result.success || !result.topUsers) {
    console.error("Failed to load leaderboard");
    return null;
  }

  const topUsers: User[] = result.topUsers;
  const currentUser: CurrentUserData | null =
    (result.currentUser as CurrentUserData | null) ?? null;

  if (!topUsers.length) return null;

  return (
    <section className={styles.leaderboard}>
      <h2 className={styles.title + " title-font"}>🏆LEADERBOARD</h2>

      <div className={styles.list}>
        {topUsers.map((u, index) => (
          <div key={u.id} className={styles.card + " text-font"}>
            <div className="flex gap-2">
              <div className={styles.rank}>#{index + 1}</div>
              <div className={styles.userProfileImage}>
                <Image
                  alt={u.username}
                  src={u.profile_image_url}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className={styles.username}>{u.username}</div>
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
              <span>{u.total_won}</span>
            </div>
          </div>
        ))}
      </div>

      {currentUser && (
        <div className={styles.currentUser + " text-font"}>
          Your Rank: <strong>#{currentUser.rank}</strong> –{" "}
          {currentUser.user.username} –{" "}
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
