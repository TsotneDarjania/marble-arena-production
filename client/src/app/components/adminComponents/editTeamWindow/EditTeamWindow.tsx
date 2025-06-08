"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { TeamDataType } from "@/app/types/gameDataTypes";
import { getTeamsFromDatabase } from "@/app/utils/supabase/actions/getTeams";
import { updateTeamInDatabase } from "@/app/utils/supabase/actions/updateTeam";
import Image from "next/image";

type EditTeamFormData = Partial<
  Omit<TeamDataType, "team_logo_url"> & {
    team_logo_url?: File | string;
    is_national_team?: "yes" | "no";
    fifa_raiting?: number;
  }
>;

export default function EditTeamWindow() {
  const [teams, setTeams] = useState<TeamDataType[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditTeamFormData | null>(null);

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

  useEffect(() => {
    if (selectedTeamId) {
      const team = teams.find((t) => t.id === Number(selectedTeamId));
      if (team) {
        setFormData({
          ...team,
          is_national_team: "no",
        });
      }
    }
  }, [selectedTeamId, teams]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value, type } = target;

    if (
      name === "team_logo_url" &&
      type === "file" &&
      target instanceof HTMLInputElement &&
      target.files
    ) {
      const file = target.files[0];
      if (file) {
        setFormData((prev): EditTeamFormData => {
          if (!prev) return { team_logo_url: file };
          return {
            ...prev,
            team_logo_url: file,
          };
        });
      }
      return;
    }

    setFormData((prev) => ({
      ...prev!,
      [name]: type === "number" ? Number(value) : value,
    }));

    if (name === "fifa_raiting" || name === "is_national_team") {
      const rating =
        name === "fifa_raiting" ? Number(value) : formData?.fifa_raiting;
      const isNational =
        name === "is_national_team"
          ? value
          : formData?.is_national_team ?? "no";
      autoCalculateStats(rating, isNational);
    }
  }

  function autoCalculateStats(
    fifa: number | undefined,
    isNational: string | undefined
  ) {
    if (!fifa) return;
    const inputMin = 800;
    const inputMax = isNational === "yes" ? 2000 : 2200;
    const clamped = Math.max(inputMin, Math.min(fifa, inputMax));
    const scale = (clamped - inputMin) / (inputMax - inputMin);
    const finalValue = Math.round(20 + scale * (99 - 20));

    setFormData((prev) => ({
      ...prev!,
      attack_speed: String(finalValue),
      goalkeeper_speed: finalValue,
      defence_speed: finalValue,
      midfielder_speed: finalValue,
      pass_accuracy: finalValue,
      pass_speed: finalValue,
      shoot_accuracy: finalValue,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) return;

    const form = new FormData();
    form.append("id", String(selectedTeamId));
    form.append("name", formData.name ?? "");
    form.append("tablo_name", formData.tablo_name ?? "");
    form.append("primary_color", formData.primary_color ?? "#000000");
    form.append("secondary_color", formData.secondary_color ?? "#ffffff");
    form.append("attack_speed", formData.attack_speed ?? "0");
    form.append("attack_strategy", formData.attack_strategy ?? "normal");
    form.append("default_strategy", formData.default_strategy ?? "4-4-2");
    form.append("defence_strategy", formData.defence_strategy ?? "normal");
    form.append(
      "midfielder_strategy",
      formData.midfielder_strategy ?? "normal"
    );
    form.append("goalkeeper_speed", String(formData.goalkeeper_speed ?? 0));
    form.append("defence_speed", String(formData.defence_speed ?? 0));
    form.append("midfielder_speed", String(formData.midfielder_speed ?? 0));
    form.append("pass_accuracy", String(formData.pass_accuracy ?? 0));
    form.append("pass_speed", String(formData.pass_speed ?? 0));
    form.append("shoot_accuracy", String(formData.shoot_accuracy ?? 0));
    form.append("fault_possibility", String(formData.fault_possibility ?? 0));
    form.append("fifa_raiting", String(formData.fifa_raiting ?? 0));
    form.append(
      "existing_logo_url",
      typeof formData.team_logo_url === "string" ? formData.team_logo_url : ""
    );

    if (
      formData.team_logo_url &&
      typeof formData.team_logo_url !== "string" &&
      "name" in formData.team_logo_url
    ) {
      form.append("team_logo_url", formData.team_logo_url as File);
    }

    const result = await updateTeamInDatabase(form);
    if (result.success) {
      alert("Team updated!");
      window.location.reload();
    } else {
      alert("Error: " + result.message);
    }
  }

  return (
    <div className={styles.editTeamWindow}>
      <h2>Edit Team</h2>

      <select
        value={selectedTeamId ?? ""}
        onChange={(e) => setSelectedTeamId(e.target.value)}
      >
        <option value="">Select a Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {formData && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Team Name
            <input
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Tablo Name
            <input
              name="tablo_name"
              value={formData.tablo_name ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Team Logo
            {formData.team_logo_url &&
              typeof formData.team_logo_url === "string" && (
                <Image
                  src={formData.team_logo_url}
                  alt="Team Logo"
                  style={{ maxWidth: "100px", marginTop: "10px" }}
                />
              )}
            <input
              type="file"
              name="team_logo_url"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          <label>
            Is National Team?
            <select
              name="is_national_team"
              onChange={handleChange}
              value={formData.is_national_team ?? "no"}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            FIFA Rating
            <input
              name="fifa_raiting"
              type="number"
              value={formData.fifa_raiting ?? ""}
              onChange={handleChange}
            />
          </label>

          {/* Auto-filled stat fields */}
          <label>
            Primary Color
            <input
              type="color"
              name="primary_color"
              value={formData.primary_color ?? "#000000"}
              onChange={handleChange}
            />
          </label>
          <label>
            Secondary Color
            <input
              type="color"
              name="secondary_color"
              value={formData.secondary_color ?? "#ffffff"}
              onChange={handleChange}
            />
          </label>
          <label>
            Attack Speed
            <input
              type="number"
              name="attack_speed"
              value={formData.attack_speed ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Attack Strategy
            <select
              name="attack_strategy"
              value={formData.attack_strategy ?? "normal"}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="wide-back">Wide Back</option>
            </select>
          </label>
          <label>
            Default Strategy
            <select
              name="default_strategy"
              value={formData.default_strategy ?? "4-4-2"}
              onChange={handleChange}
            >
              <option value="4-4-2">4-4-2</option>
              <option value="5-3-2">5-3-2</option>
              <option value="3-4-4">3-4-4</option>
              <option value="3-5-2">3-5-2</option>
              <option value="3-3-4">3-3-4</option>
              <option value="4-3-3">4-3-3</option>
              <option value="5-4-1">5-4-1</option>
            </select>
          </label>
          <label>
            Defence Strategy
            <select
              name="defence_strategy"
              value={formData.defence_strategy ?? "normal"}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="wide-attack">Wide Attack</option>
              <option value="wide-back">Wide Back</option>
              <option value="center-attack">Center Attack</option>
            </select>
          </label>
          <label>
            Midfielder Strategy
            <select
              name="midfielder_strategy"
              value={formData.midfielder_strategy ?? "normal"}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="wide-attack">Wide Attack</option>
              <option value="wide-back">Wide Back</option>
            </select>
          </label>
          <label>
            Goalkeeper Speed
            <input
              type="number"
              name="goalkeeper_speed"
              value={formData.goalkeeper_speed ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Defence Speed
            <input
              type="number"
              name="defence_speed"
              value={formData.defence_speed ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Midfielder Speed
            <input
              type="number"
              name="midfielder_speed"
              value={formData.midfielder_speed ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Pass Accuracy
            <input
              type="number"
              name="pass_accuracy"
              value={formData.pass_accuracy ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Pass Speed
            <input
              type="number"
              name="pass_speed"
              value={formData.pass_speed ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Shoot Accuracy
            <input
              type="number"
              name="shoot_accuracy"
              value={formData.shoot_accuracy ?? ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Fault Possibility
            <input
              type="number"
              name="fault_possibility"
              value={formData.fault_possibility ?? ""}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Update Team</button>
        </form>
      )}
    </div>
  );
}
