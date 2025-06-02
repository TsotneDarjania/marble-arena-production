"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { getPromotionTeamsFromDatabase } from "@/app/utils/supabase/actions/getPromotionTeams";
import { userVoteTeam } from "@/app/utils/supabase/actions/userVoteTeam";
import { useAppContext } from "@/app/context/AppContexty";

export type PromotionTeamType = {
  team_name: string;
  voted_coins: string;
  team_logo_url: string;
};

type VoteResult =
  | {
      success: true;
      newUserCoins: number;
      newTeamVotes: number;
    }
  | {
      success: false;
      message: string;
    };

export default function VoteSection() {
  const [teams, setTeams] = useState<PromotionTeamType[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [loadingTeamName, setLoadingTeamName] = useState<string | null>(null);

  const { user, setUser } = useAppContext();

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const data = await getPromotionTeamsFromDatabase();
    if (data) setTeams(data);
  }

  const handleInputChange = (teamName: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [teamName]: value,
    }));
  };

  const handleVote = async (teamName: string) => {
    const input = inputValues[teamName];
    const amount = parseInt(input);

    if (!amount || amount <= 0 || !user) return;

    if (user.coins < amount) {
      alert("You don't have enough coins to vote!");
      return;
    }

    setLoadingTeamName(teamName);

    const result: VoteResult = await userVoteTeam(user.id, teamName, amount);

    if (!result.success) {
      alert(result.message);
      setLoadingTeamName(null);
      return;
    }

    // Update user coins
    setUser?.({
      ...user,
      coins: result.newUserCoins,
    });

    // Update team vote count
    setTeams((prev) =>
      prev.map((team) =>
        team.team_name === teamName
          ? {
              ...team,
              voted_coins: result.newTeamVotes.toString(),
            }
          : team
      )
    );

    // Clear input
    setInputValues((prev) => ({
      ...prev,
      [teamName]: "",
    }));

    setLoadingTeamName(null);
  };

  return (
    <section className={styles.voteSection}>
      <h2 className={styles.title + " title-font"}>
        VOTE FOR YOUR FAVORITE TEAM FOR PROMOTION
      </h2>

      <div className={styles.teamList + " title-font"}>
        {teams.map((team) => (
          <div className={styles.teamItem} key={team.team_name}>
            <img
              src={team.team_logo_url}
              alt={team.team_name}
              className={styles.logo}
            />
            <span className={styles.teamName}>{team.team_name}</span>

            <div className={styles.voteControls}>
              <label
                htmlFor={`input-${team.team_name}`}
                className={styles.voteLabel}
              >
                COINS:
              </label>
              <input
                type="number"
                id={`input-${team.team_name}`}
                min="1"
                value={inputValues[team.team_name] || ""}
                onChange={(e) =>
                  handleInputChange(team.team_name, e.target.value)
                }
                className={styles.voteInput}
              />
              <img
                src="/images/marble-coin.png"
                alt="Marble Coin"
                className={styles.coin}
              />
              <button
                className={styles.voteButton}
                disabled={loadingTeamName === team.team_name}
                onClick={() => handleVote(team.team_name)}
              >
                {loadingTeamName === team.team_name ? "Voting..." : "VOTE"}
              </button>
            </div>

            <div className={styles.voteCount}>
              Total Coins: {team.voted_coins}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
