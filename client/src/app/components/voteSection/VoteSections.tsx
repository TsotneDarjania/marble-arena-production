"use client";

import React, { useState } from "react";
import styles from "./style.module.css";

interface Team {
  name: string;
  logo: string;
}

const teams: Team[] = [
  {
    name: "Roma",
    logo: "/images/teams/roma.png",
  },
  {
    name: "Inter",
    logo: "/images/teams/inter.png",
  },
  {
    name: "Juventus",
    logo: "/images/teams/juventus.png",
  },
  {
    name: "Bologna",
    logo: "/images/teams/bologna.png",
  },
];

export default function VoteSection() {
  const [votes, setVotes] = useState<Record<string, number>>({});

  const handleVote = (teamName: string, amount: number) => {
    if (!amount || amount <= 0) return;
    setVotes((prev) => ({
      ...prev,
      [teamName]: (prev[teamName] || 0) + amount,
    }));
    console.log(`Voted ${amount} coins for ${teamName}`);
  };

  return (
    <section className={styles.voteSection}>
      <h2 className={styles.title + " title-font"}>
        VOTE FOR YOUR FAVORITE TEAM
      </h2>
      <div className={styles.teamList + " title-font"}>
        {teams.map((team) => (
          <div className={styles.teamItem} key={team.name}>
            <img src={team.logo} alt={team.name} className={styles.logo} />
            <span className={styles.teamName}>{team.name}</span>
            <div className={styles.voteControls}>
              <label
                htmlFor={`input-${team.name}`}
                className={styles.voteLabel}
              >
                COINS:
              </label>
              <input
                type="number"
                id={`input-${team.name}`}
                min="1"
                className={styles.voteInput}
              />
              <img
                src="/images/marble-coin.png"
                alt="Marble Coin"
                className={styles.coin}
              />
              <button
                className={styles.voteButton}
                onClick={() => {
                  const input = document.getElementById(
                    `input-${team.name}`
                  ) as HTMLInputElement;
                  handleVote(team.name, parseInt(input.value));
                  input.value = "";
                }}
              >
                VOTE
              </button>
            </div>
            <div className={styles.voteCount}>
              Total Coins: {votes[team.name] || 0}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
