"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { TeamDataType } from "@/app/types/gameDataTypes";
import { addTeamToDatabase } from "@/app/utils/supabase/actions/addTeam";

export default function AddTeamWindow() {
  type AddTeamFormData = Partial<Omit<TeamDataType, "team_logo_url">> & {
    team_logo_url?: File;
    is_national_team?: "yes" | "no";
  };

  const [formData, setFormData] = useState<AddTeamFormData>({
    is_national_team: "no", // ✅ Default to "no"
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);

    if (name === "fifa_raiting" || name === "is_national_team") {
      const rating = Number(
        name === "fifa_raiting" ? value : formData.fifa_raiting
      );
      const isNational =
        name === "is_national_team" ? value : formData.is_national_team ?? "no";

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
      ...prev,
      attack_speed: String(finalValue),
      goalkeeper_speed: finalValue,
      defence_speed: finalValue,
      midfielder_speed: finalValue,
      pass_accuracy: finalValue,
      pass_speed: finalValue - 20,
      shoot_accuracy: finalValue - 30,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData)

    const result = await addTeamToDatabase(formData);

    if (result.success) {
      alert("Team created successfully!");
      window.location.reload();
    } else {
      alert("Error: " + result.message);
      console.log(result.message);
    }
  }

  return (
    <div className={styles.addTeamWindow}>
      <h2>Add New Team</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Team Name
          <input name="name" placeholder="Team Name" onChange={handleChange} />
        </label>

        <label>
          Tablo Name
          <input
            name="tablo_name"
            placeholder="Tablo Name"
            onChange={handleChange}
          />
        </label>

        <label>
          Team Logo (PNG)
          <input
            name="team_logo_url"
            type="file"
            accept=".png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData((prev) => ({ ...prev, team_logo_url: file }));
              }
            }}
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
          Primary Color
          <input type="color" name="primary_color" onChange={handleChange} />
        </label>

        <label>
          Secondary Color
          <input type="color" name="secondary_color" onChange={handleChange} />
        </label>

        <label>
          Attack Speed
          <input
            name="attack_speed"
            value={formData.attack_speed ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Attack Strategy
          <select name="attack_strategy" onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="wide-back">Wide Back</option>
          </select>
        </label>

        <label>
          Default Strategy
          <select name="default_strategy" onChange={handleChange}>
            <option value="4-4-2">4-4-2</option>
            <option value="5-3-2">5-3-2</option>
            <option value="3-5-2">3-5-2</option>
            <option value="3-3-4">3-3-4</option>
            <option value="4-3-3">4-3-3</option>
            <option value="5-4-1">5-4-1</option>
            <option value="3-4-3">3-4-3</option>
          </select>
        </label>

        <label>
          Defence Strategy
          <select name="defence_strategy" onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="wide-attack">Wide Attack</option>
            <option value="wide-back">Wide Back</option>
          </select>
        </label>

        <label>
          Midfielder Strategy
          <select name="midfielder_strategy" onChange={handleChange}>
            <option value="normal">Normal</option>
            <option value="wide-attack">Wide Attack</option>
            <option value="wide-back">Wide Back</option>
            <option value="center-attack">Center Attack</option>
          </select>
        </label>

        <label>
          Goalkeeper Speed
          <input
            name="goalkeeper_speed"
            type="number"
            value={formData.goalkeeper_speed ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Defence Speed
          <input
            name="defence_speed"
            type="number"
            value={formData.defence_speed ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Midfielder Speed
          <input
            name="midfielder_speed"
            type="number"
            value={formData.midfielder_speed ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Pass Accuracy
          <input
            name="pass_accuracy"
            type="number"
            value={formData.pass_accuracy ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Pass Speed
          <input
            name="pass_speed"
            type="number"
            value={formData.pass_speed ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Shoot Accuracy
          <input
            name="shoot_accuracy"
            type="number"
            value={formData.shoot_accuracy ?? ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Fault Possibility
          <input
            name="fault_possibility"
            type="number"
            onChange={handleChange}
          />
        </label>

        <label>
          FIFA Rating
          <input
            name="fifa_raiting"
            type="number"
            placeholder="FIFA Rating"
            value={formData.fifa_raiting ?? ""}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Add Team</button>
      </form>
    </div>
  );
}
