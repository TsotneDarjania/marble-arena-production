import Image from "next/image";
import styles from "./style.module.css";
import { getTeamsFromDatabase } from "@/app/utils/supabase/actions/getTeams";
import { TeamDataType } from "@/app/types/gameDataTypes";

export default async function TeamsExhibition() {
  const response = await getTeamsFromDatabase();

  let logos: string[] = [];

  if (response.success) {
    logos = response.data
      .map((team: TeamDataType) => team.team_logo_url)
      .filter((url): url is string => Boolean(url)); // type narrowing
  } else {
    console.error("Failed to load teams:", response.message);
  }

  if (!logos.length) return null;

  // duplicate logos for seamless marquee loop
  const scrollingLogos = [...logos, ...logos];

  return (
    <section className={styles.wrapper}>
      <h2 className="title-font">Marble Teams</h2>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {scrollingLogos.map((src, index) => (
            <div key={index} className={styles.logo}>
              <Image
                alt="Team logo"
                src={src}
                fill
                sizes="120px"
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
