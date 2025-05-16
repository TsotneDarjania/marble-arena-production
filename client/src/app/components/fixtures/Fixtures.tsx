import Image from "next/image";
import styles from "./style.module.css";

export default function Fixtures() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.fixtures}>
        <div className={styles.fixture}>
          <div className={styles.teamInitials}>
            <div className={styles.teamLogo}>
              <Image
                fill
                objectFit="contain"
                alt="team logo"
                src={"/images/teams/Bologna.png"}
              />
            </div>
            <p> Manchester United</p>
          </div>
        </div>
      </div>
    </div>
  );
}
