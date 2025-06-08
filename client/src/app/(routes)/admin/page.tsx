"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import Shadow from "@/app/components/utils/shadow/Shadow";

import AddTeamWindow from "@/app/components/adminComponents/addTeamWindow/AddTeamWindow";
import EditTeamWindow from "@/app/components/adminComponents/editTeamWindow/EditTeamWindow";
import DeleteTeamWindow from "@/app/components/adminComponents/deleteTeamWindow/DeleteTeamWindow";
import AddPromotionTeamsWindow from "@/app/components/adminComponents/addPromotionTeamsWindow/AddPromotionTeamsWindow";
import CreateLeagueWindow from "@/app/components/adminComponents/createLeagueWindow/CreateLeagueWindow";

import { getFixturesForFrontend } from "@/app/utils/supabase/actions/getFixturesForFrontend";
import { getCurrentLeagueWeek } from "@/app/utils/supabase/actions/getCurrentLeagueWeek";
import { submitWeekResults } from "@/app/utils/supabase/actions/submitWeekResults";
import { useAppContext } from "@/app/context/AppContexty";
import Image from "next/image";

type Fixture = {
  host?: {
    id: string;
    teamName: string;
    imageSrc: string;
    winCoefficient: number;
  };
  guest?: {
    id: string;
    teamName: string;
    imageSrc: string;
    winCoefficient: number;
  };
  drawCoefficient: number;
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
  const [isSubmittingResults, setIsSubmittingResults] = useState(false);
  const [resultsInput, setResultsInput] = useState<
    Record<string, { hostScore: string; guestScore: string }>
  >({});
  const [currentWeek, setCurrentWeek] = useState<number>(0);
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
      const res = await getCurrentLeagueWeek();
      if (res.success && res.currentWeek !== null) {
        setCurrentWeek(res.currentWeek);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getFixturesForFrontend();
      if (res.success && res.data) {
        setFixturesByWeek(res.data);
        console.log("Fetched Fixtures:", res.data);
      } else {
        console.error("Error fetching fixtures:", res.message);
        setFixturesByWeek(null);
      }
      setLoading(false);
    })();
  }, []);

  const currentWeekFixtures = fixturesByWeek?.[`week_${currentWeek}`];

  const { user } = useAppContext();

  if (user?.username !== "Admin" || !user) {
    window.location.href = "/";
    return null;
  }

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

      {!loading && currentWeekFixtures && currentWeekFixtures.length > 0 && (
        <div className={styles.weekSection}>
          <h2 className={styles.weekTitle}>Fixtures for Week {currentWeek}</h2>
          {currentWeekFixtures.map((fixture, index) => {
            if (!fixture.host || !fixture.guest) return null;

            const fixtureKey = `${fixture.host.id}_${fixture.guest.id}`;
            const input = resultsInput[fixtureKey] || {
              hostScore: "",
              guestScore: "",
            };

            return (
              <div key={index} className={styles.fixtureRow}>
                <div className={styles.teamColumn}>
                  <Image
                    src={fixture.host.imageSrc}
                    alt={fixture.host.teamName}
                    width={50}
                    height={50}
                  />
                  <span className={styles.teamName}>
                    {fixture.host.teamName}
                  </span>
                </div>

                <span className={styles.vsText}>vs</span>

                <div className={styles.teamColumn}>
                  <Image
                    src={fixture.guest.imageSrc}
                    alt={fixture.guest.teamName}
                    width={50}
                    height={50}
                  />
                  <span className={styles.teamName}>
                    {fixture.guest.teamName}
                  </span>
                </div>

                {isSubmittingResults ? (
                  <div className={styles.resultInputs}>
                    <input
                      type="number"
                      placeholder="Host Score"
                      value={input.hostScore}
                      onChange={(e) =>
                        setResultsInput((prev) => ({
                          ...prev,
                          [fixtureKey]: {
                            hostScore: e.target.value,
                            guestScore: input.guestScore,
                          },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="Guest Score"
                      value={input.guestScore}
                      onChange={(e) =>
                        setResultsInput((prev) => ({
                          ...prev,
                          [fixtureKey]: {
                            hostScore: input.hostScore,
                            guestScore: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                ) : (
                  <button
                    className={styles.playButton}
                    onClick={() =>
                      router.push(
                        `/game?host=${fixture.host!.id}&guest=${
                          fixture.guest!.id
                        }`
                      )
                    }
                  >
                    Play
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isSubmittingResults ? (
        <button
          className={styles.featureButton}
          onClick={() => setIsSubmittingResults(true)}
        >
          Move To Next Week
        </button>
      ) : (
        <button
          className={styles.submitButton}
          onClick={async () => {
            const result = await submitWeekResults({
              week: currentWeek,
              results: resultsInput,
            });

            if (result.success) {
              window.location.reload();
            } else {
              alert("Failed to update results");
            }
          }}
        >
          Submit Results
        </button>
      )}
    </div>
  );
}
