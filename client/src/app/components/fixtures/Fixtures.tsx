"use client";

import Image from "next/image";
import styles from "./style.module.css";
import { Fragment, useState } from "react";

export default function Fixtures() {
  const currentWeek = 2;
  const [week, setWeek] = useState(currentWeek);
  const [openFixtures, setOpenFixtures] = useState<number[]>([]);

  const [bets, setBets] = useState<{
    [fixtureIndex: number]: {
      option: "host" | "draw" | "guest" | null;
      amount: number;
      multiplier: number;
    };
  }>({});

  const toggleFixture = (index: number) => {
    setOpenFixtures((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOptionSelect = (
    index: number,
    option: "host" | "draw" | "guest",
    multiplier: number
  ) => {
    setBets((prev) => ({
      ...prev,
      [index]: {
        option,
        amount: prev[index]?.amount || 0,
        multiplier,
      },
    }));
  };

  const handleAmountChange = (index: number, amount: number) => {
    setBets((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        amount,
      },
    }));
  };

  const data = {
    week_1: [
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
    ],
    week_2: [
      {
        hosT: {
          teamName: "Barcelona",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 5,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
    ],
    week_3: [
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
      {
        hosT: {
          teamName: "Juventus",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 2,
        },
        guest: {
          teamName: "Liverpool",
          imageSrc: "/images/teams/Bologna.png",
          winCoefficient: 3,
        },
        drawCoefficient: 4,
        date: "FRY : 12:00",
        result: "0 - 0",
      },
    ],
  };

  const currentWeekKey = `week_${week}` as keyof typeof data;

  const handlePrevious = () => {
    setWeek((prev) => {
      const newWeek = prev > 1 ? prev - 1 : prev;
      setOpenFixtures([]);
      return newWeek;
    });
  };

  const handleNext = () => {
    setWeek((prev) => {
      const newWeek = prev < 3 ? prev + 1 : prev;
      setOpenFixtures([]);
      return newWeek;
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.navigationButtons + " text-font"}>
        <button
          onClick={handlePrevious}
          style={{ opacity: week === 1 ? "0" : "1" }}
        >
          ← Previous
        </button>
        <span className={styles.weekLabel}>Week {week}</span>
        <button
          onClick={handleNext}
          style={{ opacity: week === Object.keys(data).length ? "0" : "1" }}
        >
          Next →
        </button>
      </div>

      <div className={styles.fixtures}>
        {data[currentWeekKey].map((item, index) => (
          <Fragment key={index + item.date}>
            <div className={styles.fixture}>
              <div className={styles.teamInitials + " justify-end"}>
                <div className={styles.teamLogo}>
                  <Image
                    fill
                    objectFit="contain"
                    alt="team logo"
                    src={item.hosT.imageSrc}
                  />
                </div>
                <div className="flex flex-col">
                  <p className={styles.teamName + " text-font"}>
                    {item.hosT.teamName}
                  </p>
                  <p className={styles.teamPosition + " text-font"}>2nd</p>
                </div>
              </div>

              {week < currentWeek ? (
                <p className={styles.result}>{item.result}</p>
              ) : (
                <button
                  className={styles.betButton + " text-font"}
                  onClick={() => toggleFixture(index)}
                >
                  {openFixtures.includes(index) ? "Close" : "BET"}
                </button>
              )}

              <div className={styles.teamInitials + " justify-start"}>
                <div className="flex flex-col items-end">
                  <p className={styles.teamName + " text-font"}>
                    {item.guest.teamName}
                  </p>
                  <p className={styles.teamPosition + " text-font"}>2nd</p>
                </div>
                <div className={styles.teamLogo}>
                  <Image
                    fill
                    objectFit="contain"
                    alt="team logo"
                    src={item.guest.imageSrc}
                  />
                </div>
              </div>
            </div>

            {week >= currentWeek && openFixtures.includes(index) && (
              <div className={styles.betWindow + " text-font"}>
                <div
                  className={
                    styles.betOption +
                    (bets[index]?.option === "host"
                      ? " " + styles.selected
                      : "")
                  }
                  onClick={() =>
                    handleOptionSelect(index, "host", item.hosT.winCoefficient)
                  }
                >
                  {`${item.hosT.teamName} win (${item.hosT.winCoefficient}x)`}
                </div>
                <div
                  className={
                    styles.betOption +
                    (bets[index]?.option === "draw"
                      ? " " + styles.selected
                      : "")
                  }
                  onClick={() =>
                    handleOptionSelect(index, "draw", item.drawCoefficient)
                  }
                >
                  {`Draw (${item.drawCoefficient}x)`}
                </div>
                <div
                  className={
                    styles.betOption +
                    (bets[index]?.option === "guest"
                      ? " " + styles.selected
                      : "")
                  }
                  onClick={() =>
                    handleOptionSelect(
                      index,
                      "guest",
                      item.guest.winCoefficient
                    )
                  }
                >
                  {`${item.guest.teamName} win (${item.guest.winCoefficient}x)`}
                </div>
                <input
                  placeholder="0"
                  type="number"
                  className={styles.betValue}
                  value={bets[index]?.amount || ""}
                  onChange={(e) =>
                    handleAmountChange(index, parseFloat(e.target.value) || 0)
                  }
                />
                <div className={styles.amount}>
                  +
                  {bets[index]?.amount && bets[index]?.multiplier
                    ? bets[index].amount * bets[index].multiplier
                    : 0}
                </div>
                <button className={styles.submitBetBtn + " text-font"}>
                  Submit
                </button>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
