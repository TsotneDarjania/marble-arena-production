"use client";

import AddTeamWindow from "@/app/components/adminComponents/addTeamWindow/AddTeamWindow";
import styles from "./style.module.css";
import Shadow from "@/app/components/utils/shadow/Shadow";
import { useState } from "react";
import EditTeamWindow from "@/app/components/adminComponents/editTeamWindow/EditTeamWindow";

export default function AdminPage() {
  const [isOpenAddTeams, setIsOpenAddTeams] = useState(false);
  const [isOpenEditTeam, setIsOpenEditTeam] = useState(false);
  const [isShadow, setIsShadow] = useState(false);

  function handleCloseWindows() {
    setIsOpenAddTeams(false);
    setIsOpenEditTeam(false);

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
      <button
        onClick={() => {
          setIsShadow(true);
          setIsOpenEditTeam(true);
        }}
        className={styles.featureButton}
      >
        Edit Team
      </button>
      <button className={styles.featureButton}> Delete Team</button>
      <button className={styles.featureButton}> Create League</button>

      {isOpenAddTeams && <AddTeamWindow />}
      {isOpenEditTeam && <EditTeamWindow />}

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
