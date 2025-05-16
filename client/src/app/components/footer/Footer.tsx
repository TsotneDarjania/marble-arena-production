import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title + " title-font"}>FOLLOW US</h2>

      <div className={styles.icons + " text-font"}>
        <Link href="https://youtube.com" target="_blank">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/youtube.png"
                alt="YouTube"
                objectFit="contain"
                fill
              />
            </div>

            <span>YOUTUBE</span>
          </div>
        </Link>

        <Link href="https://tiktok.com" target="_blank">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/tiktok.png"
                alt="TikTok"
                objectFit="contain"
                fill
              />
            </div>
            <span>TIKTOK</span>
          </div>
        </Link>

        <Link href="https://instagram.com" target="_blank">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/instagram.png"
                alt="Instagram"
                objectFit="contain"
                fill
              />
            </div>
            <span>INSTAGRAM</span>
          </div>
        </Link>

        <Link href="https://facebook.com" target="_blank">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/facebook.png"
                alt="Facebook"
                objectFit="contain"
                fill
              />
            </div>
            <span>FACEBOOK</span>
          </div>
        </Link>

        <Link href="mailto:contact@marblearena.com">
          <div className={styles.icon}>
            <div className={styles.image}>
              <Image
                src="/images/gmail.png"
                alt="Gmail"
                objectFit="contain"
                fill
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
