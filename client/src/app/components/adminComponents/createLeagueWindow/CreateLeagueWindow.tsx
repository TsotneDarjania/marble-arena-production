"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { TeamDataType } from "@/app/types/gameDataTypes";
import { getTeamsFromDatabase } from "@/app/utils/supabase/actions/getTeams";
import { saveLeagueWithFixtures } from "@/app/utils/supabase/actions/createLeague";

export default function CreateLeagueWindow() {
  const [teams, setTeams] = useState<TeamDataType[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    void (async () => {
      const response = await getTeamsFromDatabase();
      if (response.success) {
        setTeams(response.data);
      } else {
        console.error("Failed to fetch teams:", response.message);
      }
    })();
  }, []);

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(teamId) ? newSet.delete(teamId) : newSet.add(teamId);
      return newSet;
    });
  };

  const handleCreateLeague = async () => {
    if (selectedTeamIds.size < 2) {
      alert("Select at least 2 teams.");
      return;
    }

    const selectedTeams = teams
      .filter((team) => selectedTeamIds.has(team.id))
      .map((team) => ({
        id: team.id,
        name: team.name,
        logo: team.team_logo_url,
      }));

    const result = await saveLeagueWithFixtures(selectedTeams);
    console.log(result);
    if (result.success) {
      alert("League created!");
      setSelectedTeamIds(new Set());
      window.location.reload();
    } else {
      alert("Error: " + result.message);
    }
  };

  return (
    <div className={styles.createLeagueWindow}>
      <h2>Create New League</h2>

      <ul className={styles.teamList}>
        {teams.map((team) => (
          <li key={team.id} className={styles.teamItem}>
            <label>
              <input
                type="checkbox"
                checked={selectedTeamIds.has(team.id)}
                onChange={() => toggleTeamSelection(team.id)}
              />
              {team.name}
            </label>
          </li>
        ))}
      </ul>

      <button className={styles.generateButton} onClick={handleCreateLeague}>
        Create League
      </button>
    </div>
  );
}
