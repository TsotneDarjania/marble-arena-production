"use client";

import { useAppContext } from "@/app/context/AppContexty";
import styles from "./style.module.css";
import { useEffect, useState } from "react";

export default function AuthModal() {
  const { isAuthModalOpen } = useAppContext();

  const [isLoginState, setisLoginState] = useState(true);

  useEffect(() => {
    setisLoginState(true);
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  return (
    <div className={styles.modal}>
      <h2 className={styles.title + " title-font"}>LOGIN / REGISTER</h2>

      <form
        className={styles.form + " text-font"}
        onSubmit={(e) => e.preventDefault()}
      >
        {!isLoginState && (
          <>
            <label>Username</label>
            <input
              maxLength={20}
              type="text"
              placeholder="Enter your username"
            />
          </>
        )}

        <label>Email address</label>
        <input maxLength={50} type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input
          maxLength={30}
          type="password"
          placeholder="Enter your password"
        />

        <div className="w-[100%]">
          {isLoginState ? (
            <button type="submit" className={styles.loginBtn}>
              LOGIN
            </button>
          ) : (
            <button type="submit" className={styles.registerBtn}>
              REGISTER
            </button>
          )}
        </div>
        {isLoginState && (
          <p
            onClick={() => {
              setisLoginState(false);
            }}
            className={styles.registerLink}
          >
            REGISTER
          </p>
        )}
      </form>

      <footer className={styles.footer}>© 2024 Marble Arena</footer>
    </div>
  );
}
