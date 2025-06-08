"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { getPromotionTeamsFromDatabase } from "@/app/utils/supabase/actions/getPromotionTeams";
import { addPromotionTeamToDatabase } from "@/app/utils/supabase/actions/addPromotionTeam"; // you'll create this
import Image from "next/image";

export type PromotionTeamType = {
  team_name: string;
  voted_coins: string;
  team_logo_url: string;
};

export default function AddPromotionTeamsWindow() {
  const [teams, setTeams] = useState<PromotionTeamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{
    team_name: string;
    team_logo_url?: File;
  }>({ team_name: "" });

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    const data = await getPromotionTeamsFromDatabase();
    if (data) setTeams(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.team_name || !formData.team_logo_url) return;

    const submitData = new FormData();
    submitData.append("team_name", formData.team_name);
    submitData.append("team_logo_url", formData.team_logo_url);

    const result = await addPromotionTeamToDatabase(submitData);
    if (result.success) {
      setFormData({ team_name: "" });
      await fetchTeams(); // Refresh the list
    } else {
      alert(result.message || "Something went wrong");
    }
  }

  return (
    <div className={styles.addPromotionTeamsWindow}>
      <h2>Promotion Teams</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="team_name"
          placeholder="Team Name"
          value={formData.team_name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, team_name: e.target.value }))
          }
        />

        <input
          type="file"
          name="team_logo_url"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFormData((prev) => ({
                ...prev,
                team_logo_url: e.target.files![0],
              }));
            }
          }}
        />

        <button type="submit">Add Promotion Team</button>
      </form>

      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <ul className={styles.teamList}>
          {teams.map((team, index) => (
            <li key={index} className={styles.teamItem}>
              <Image
                src={team.team_logo_url}
                alt={team.team_name}
                width={50}
                height={50}
              />
              <span>{team.team_name}</span>
              <span className={styles.votes}>Votes: {team.voted_coins}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
