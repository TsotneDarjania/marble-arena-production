"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import Shadow from "@/app/components/utils/shadow/Shadow";

// Admin windows
import AddTeamWindow from "@/app/components/adminComponents/addTeamWindow/AddTeamWindow";
import EditTeamWindow from "@/app/components/adminComponents/editTeamWindow/EditTeamWindow";
import DeleteTeamWindow from "@/app/components/adminComponents/deleteTeamWindow/DeleteTeamWindow";
import AddPromotionTeamsWindow from "@/app/components/adminComponents/addPromotionTeamsWindow/AddPromotionTeamsWindow";
import CreateLeagueWindow from "@/app/components/adminComponents/createLeagueWindow/CreateLeagueWindow";
import { getFixturesForFrontend } from "@/app/utils/supabase/actions/getFixturesForFrontend";

type Fixture = {
  hosT: {
    id: string;
    teamName: string;
    imageSrc: string;
    winCoefficient: number;
  };
  guest: {
    id: string;
    teamName: string;
    imageSrc: string;
    winCoefficient: number;
  };
  drawCoefficient: number;
  result: "0" | "1" | "2" | "default";
};

type FixturesGroupedByWeek = Record<string, Fixture[]>;

type AdminModal =
  | "addTeam"
  | "editTeam"
  | "deleteTeam"
  | "addPromotionTeams"
  | "createLeague"
  | null;

export default function AdminPage() {
  const [activeModal, setActiveModal] = useState<AdminModal>(null);
  const [fixturesByWeek, setFixturesByWeek] =
    useState<FixturesGroupedByWeek | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const openModal = (modalName: AdminModal) => setActiveModal(modalName);
  const closeAllModals = () => setActiveModal(null);

  const buttons = [
    { label: "Add Team", modal: "addTeam" },
    { label: "Edit Team", modal: "editTeam" },
    { label: "Delete Team", modal: "deleteTeam" },
    { label: "Add Promotion Teams", modal: "addPromotionTeams" },
    { label: "Create League", modal: "createLeague" },
  ] as const;

  useEffect(() => {
    (async () => {
      const res = await getFixturesForFrontend();
      if (res.success && res.data) {
        setFixturesByWeek(res.data);
      } else {
        console.error("Error fetching fixtures:", res.message);
        setFixturesByWeek(null);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className={styles.adminPage + " text-font"}>
      {buttons.map(({ label, modal }) => (
        <button
          key={modal}
          onClick={() => openModal(modal)}
          className={styles.featureButton}
        >
          {label}
        </button>
      ))}

      {activeModal && <Shadow onClick={closeAllModals} />}
      {activeModal === "addTeam" && <AddTeamWindow />}
      {activeModal === "editTeam" && <EditTeamWindow />}
      {activeModal === "deleteTeam" && <DeleteTeamWindow />}
      {activeModal === "addPromotionTeams" && <AddPromotionTeamsWindow />}
      {activeModal === "createLeague" && <CreateLeagueWindow />}

      {!loading && fixturesByWeek?.week_1 && (
        <div className={styles.weekSection}>
          <h2 className={styles.weekTitle}>Fixtures for Week 1</h2>
          {fixturesByWeek.week_1.map((fixture, index) => (
            <div key={index} className={styles.fixtureRow}>
              <div className={styles.teamColumn}>
                <img
                  src={fixture.hosT.imageSrc}
                  alt={fixture.hosT.teamName}
                  width={50}
                  height={50}
                />
                <span className={styles.teamName}>{fixture.hosT.teamName}</span>
              </div>

              <span className={styles.vsText}>vs</span>

              <div className={styles.teamColumn}>
                <img
                  src={fixture.guest.imageSrc}
                  alt={fixture.guest.teamName}
                  width={50}
                  height={50}
                />
                <span className={styles.teamName}>
                  {fixture.guest.teamName}
                </span>
              </div>

              {fixture.result === "default" ? (
                <button
                  className={styles.playButton}
                  onClick={() =>
                    router.push(
                      `/game?host=${fixture.hosT.id}&guest=${fixture.guest.id}`
                    )
                  }
                >
                  Play
                </button>
              ) : (
                <span className={styles.resultText}>
                  Result: {fixture.result}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <button className={styles.featureButton}>Move To Next Week</button>
    </div>
  );
}
