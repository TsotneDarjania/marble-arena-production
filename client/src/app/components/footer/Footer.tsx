import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title + " title-font"}>FOLLOW US</h2>

      <div className={styles.icons + " text-font"}>
        <Link
          href="https://www.youtube.com/channel/UCZ_Ulx3qid6zZtcCLT7CFKQ"
          target="_blank"
        >
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/youtube.png"
                alt="YouTube"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span>YOUTUBE</span>
          </div>
        </Link>

        <Link href="https://www.tiktok.com/@marblearena" target="_blank">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/tiktok.png"
                alt="TikTok"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span>TIKTOK</span>
          </div>
        </Link>

        <Link
          href="https://www.facebook.com/profile.php?id=61557120621313"
          target="_blank"
        >
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/facebook.png"
                alt="Facebook"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span>FACEBOOK</span>
          </div>
        </Link>

        <Link href="mailto:marblearena10@gmail.com">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/gmail.png"
                alt="Gmail"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <span>GMAIL</span>
          </div>
        </Link>
      </div>

      <div className={styles.meta + " text-font"}>
        <p>© 2025 Marble Arena. All rights reserved.</p>
      </div>
    </footer>
  );
}
