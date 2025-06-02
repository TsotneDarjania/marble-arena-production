"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { getTeamsFromDatabase } from "@/app/utils/supabase/actions/getTeams";
import { TeamDataType } from "@/app/types/gameDataTypes";

export default function TeamsExhibition() {
  const [logos, setLogos] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const response = await getTeamsFromDatabase();
      if (response.success) {
        const validLogos = response.data
          .map((team: TeamDataType) => team.team_logo_url)
          .filter((url) => url); // remove null/undefined
        const repeated = Array(3).fill(validLogos).flat(); // Repeat for scroll
        setLogos(repeated);
      } else {
        console.error("Failed to load teams:", response.message);
      }
    })();
  }, []);

  return (
    <section className={styles.wrapper}>
      <h2 className="title-font">Marble Teams</h2>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {logos.map((src, index) => (
            <div key={index} className={styles.logo}>
              <Image
                alt="Team logo"
                src={src}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
