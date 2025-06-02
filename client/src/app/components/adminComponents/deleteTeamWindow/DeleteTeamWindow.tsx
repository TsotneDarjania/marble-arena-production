"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { TeamDataType } from "@/app/types/gameDataTypes";
import { getTeamsFromDatabase } from "@/app/utils/supabase/actions/getTeams";
import { deleteTeamFromDatabase } from "@/app/utils/supabase/actions/deleteTeamFromDatabase";

export default function DeleteTeamWindow() {
  const [teams, setTeams] = useState<TeamDataType[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const result = await getTeamsFromDatabase();
      if (result.success) {
        setTeams(result.data);
      } else {
        alert("Failed to load teams: " + result.message);
      }
    })();
  }, []);

  async function handleDelete() {
    if (!selectedTeamId) return alert("Please select a team.");

    const confirmDelete = confirm("Are you sure you want to delete this team?");
    if (!confirmDelete) return;

    const result = await deleteTeamFromDatabase(Number(selectedTeamId));
    if (result.success) {
      alert("Team deleted successfully!");
      setTeams((prev) => prev.filter((t) => t.id !== Number(selectedTeamId)));
      setSelectedTeamId("");

      //   window.location.reload();
    } else {
      alert("Failed to delete team: " + result.message);
    }
  }

  return (
    <div className={styles.deleteTeamWindow}>
      <h2>Delete a Team</h2>

      <select
        className={styles.selectTeamDropdown}
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
      >
        <option value="">Select a Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      <button onClick={handleDelete} className={styles.deleteButton}>
        Delete Team
      </button>
    </div>
  );
}
