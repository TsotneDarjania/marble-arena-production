import Image from "next/image";
import styles from "./style.module.css";

const logos = [
  "/images/teams/Bologna.png",
  "/images/teams/Inter.png",
  "/images/teams/Juventus.png",
  "/images/teams/Roma.png",
];

export default function TeamsExhibition() {
  const allLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos]; // 4x to fully cover long scroll

  return (
    <section className={styles.wrapper}>
      <h2 className="title-font">Marble Teams</h2>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {allLogos.map((src, index) => (
            <div key={index} className={styles.logo}>
              <Image
                alt="Partner logo"
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
