"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { TeamDataType } from "@/app/types/gameDataTypes";
import { addTeamToDatabase } from "@/app/utils/supabase/actions/addTeam";

export default function AddTeamWindow() {
  type AddTeamFormData = Partial<Omit<TeamDataType, "team_logo_url">> & {
    team_logo_url?: File;
  };

  const [formData, setFormData] = useState<AddTeamFormData>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

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
          Primary Color
          <input
            name="primary_color"
            placeholder="Primary Color"
            onChange={handleChange}
          />
        </label>

        <label>
          Secondary Color
          <input
            name="secondary_color"
            placeholder="Secondary Color"
            onChange={handleChange}
          />
        </label>

        <label>
          Attack Speed
          <input
            name="attack_speed"
            placeholder="Attack Speed"
            onChange={handleChange}
          />
        </label>

        <label>
          Attack Strategy
          <input
            name="attack_strategy"
            placeholder="Attack Strategy"
            onChange={handleChange}
          />
        </label>

        <label>
          Default Strategy
          <input
            name="default_strategy"
            placeholder="Default Strategy"
            onChange={handleChange}
          />
        </label>

        <label>
          Defence Strategy
          <input
            name="defence_strategy"
            placeholder="Defence Strategy"
            onChange={handleChange}
          />
        </label>

        <label>
          Midfielder Strategy
          <input
            name="midfielder_strategy"
            placeholder="Midfielder Strategy"
            onChange={handleChange}
          />
        </label>

        <label>
          Goalkeeper Speed
          <input
            name="goalkeeper_speed"
            type="number"
            placeholder="Goalkeeper Speed"
            onChange={handleChange}
          />
        </label>

        <label>
          Defence Speed
          <input
            name="defence_speed"
            type="number"
            placeholder="Defence Speed"
            onChange={handleChange}
          />
        </label>

        <label>
          Midfielder Speed
          <input
            name="midfielder_speed"
            type="number"
            placeholder="Midfielder Speed"
            onChange={handleChange}
          />
        </label>

        <label>
          Pass Accuracy
          <input
            name="pass_accuracy"
            type="number"
            placeholder="Pass Accuracy"
            onChange={handleChange}
          />
        </label>

        <label>
          Pass Speed
          <input
            name="pass_speed"
            type="number"
            placeholder="Pass Speed"
            onChange={handleChange}
          />
        </label>

        <label>
          Shoot Accuracy
          <input
            name="shoot_accuracy"
            type="number"
            placeholder="Shoot Accuracy"
            onChange={handleChange}
          />
        </label>

        <label>
          Fault Possibility
          <input
            name="fault_possibility"
            type="number"
            placeholder="Fault Possibility"
            onChange={handleChange}
          />
        </label>

        <label>
          Midfielder Speed
          <input
            name="fifa_raiting"
            type="number"
            placeholder="fifa raiting"
            onChange={handleChange}
          />
        </label>

        <button type="submit">Add Team</button>
      </form>
    </div>
  );
}
