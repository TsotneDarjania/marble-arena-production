"use client";

import AddTeamWindow from "@/app/components/adminComponents/addTeamWindow/AddTeamWindow";
import styles from "./style.module.css";
import Shadow from "@/app/components/utils/shadow/Shadow";
import { useState } from "react";

export default function AdminPage() {
  const [isOpenAddTeams, setIsOpenAddTeams] = useState(false);
  const [isShadow, setIsShadow] = useState(false);

  function handleCloseWindows() {
    setIsOpenAddTeams(false);
    setIsShadow(false);
  }

  return (
    <div className={styles.adminPage + " text-font"}>
      <button
        onClick={() => {
          setIsShadow(true);
          setIsOpenAddTeams(true);
        }}
        className={styles.featureButton}
      >
        {" "}
        Add Team
      </button>
      <button className={styles.featureButton}> Delete Team</button>
      <button className={styles.featureButton}> Create League</button>

      {isOpenAddTeams && <AddTeamWindow />}

      {isShadow && (
        <Shadow
          onClick={() => {
            handleCloseWindows();
          }}
        />
      )}
    </div>
  );
}
