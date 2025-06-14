"use client";

import styles from "./style.module.css";

export default function Hero({ embedLink }: { embedLink: string | null }) {
  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <h1 className={styles.title + " text-font"}>Marble Arena</h1>
        <p className={styles.text + " text-font"}>
          {`Watch the world's top football teams turn into marbles and play exciting matches!
Fast games, big moments, real rankings.`}
        </p>
        <button
          onClick={() => {
            window.location.href = "/league";
          }}
          className={styles.betButton + " text-font"}
          type="button"
        >
          Place Bet
        </button>
      </div>

      <div className={styles.video}>
        {embedLink ? (
          <iframe
            style={{ width: "100%", height: "100%" }}
            src={embedLink}
            title="YouTube video player"
          ></iframe>
        ) : (
          <p style={{ color: "white" }}>No video available</p>
        )}
      </div>
    </div>
  );
}
