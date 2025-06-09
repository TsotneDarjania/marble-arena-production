"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { useAppContext } from "@/app/context/AppContexty";
import Link from "next/link";
import Script from "next/script";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsAuthModalOpen, setIsShadowOpen, isLogin, user } =
    useAppContext();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.content}>
        <Link href="/" prefetch={true} onClick={handleNavItemClick}>
          <div
            className={`${styles.brandLogo} ${
              scrolled ? styles.scrolledBrandLogo : ""
            }`}
          >
            <Image
              alt="Brand Logo"
              src="/brand-logo.png"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>

        <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
          <div
            className={
              styles.hamburger +
              (isMobileMenuOpen ? ` ${styles.hamburgerActive}` : "")
            }
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <nav
          className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
        >
          <ul>
            <Link href="/league" prefetch={true} onClick={handleNavItemClick}>
              <li
                className={`${styles.menuItem} ${
                  scrolled ? styles.scrolledMenuItem : ""
                } title-font`}
              >
                <p>LEAGUE</p>
              </li>
            </Link>

            <li
              onClick={() => {
                window.open(
                  "https://www.youtube.com/channel/UCZ_Ulx3qid6zZtcCLT7CFKQ/"
                );
                handleNavItemClick();
              }}
              className={`${styles.menuItem} ${
                scrolled ? styles.scrolledMenuItem : ""
              } title-font`}
            >
              <p>YOUTUBE</p>
            </li>

            {isLogin ? (
              <>
                <Link
                  href="/profile"
                  prefetch={true}
                  onClick={handleNavItemClick}
                >
                  <div className={styles.userIndicators}>
                    <div className={styles.userProfileImage}>
                      <Image
                        alt="User Profile"
                        src={user!.profileImage}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <p className={styles.userName + " title-font"}>
                      {user?.username
                        .split(" ")
                        .map((part) => part[0]?.toUpperCase())
                        .join("")}
                    </p>
                  </div>
                </Link>

                <div className={styles.coinsWrapper}>
                  <div className={styles.marbleCoinImage}>
                    <Image
                      alt="Marble Coin Icon"
                      src="/images/marble-coin.png"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p className={styles.coinCount + " title-font"}>
                    {user?.coins.toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <li
                onClick={() => {
                  handleNavItemClick();
                  setIsShadowOpen(true);
                  setIsAuthModalOpen(true);
                }}
                className={`${styles.menuItem} ${
                  scrolled ? styles.scrolledMenuItem : ""
                } title-font`}
              >
                <p>LOGIN/REGISTER</p>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4508659001414867"
        crossOrigin="anonymous"
      />
    </header>
  );
}
