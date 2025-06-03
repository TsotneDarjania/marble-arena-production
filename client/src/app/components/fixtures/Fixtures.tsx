"use client";

import Image from "next/image";
import styles from "./style.module.css";
import { Fragment, useEffect, useState } from "react";

import { getCurrentLeagueWeek } from "@/app/utils/supabase/actions/getCurrentLeagueWeek";
import { useAppContext } from "@/app/context/AppContexty";
import { placeBetInDatabase } from "@/app/utils/supabase/actions/placeBet";
import { getFixturesForFrontend } from "@/app/utils/supabase/actions/getFixturesForFrontend";

export default function Fixtures() {
  const maxWeek = 9;
  const { user } = useAppContext();

  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [week, setWeek] = useState<number | null>(null);
  const [openFixtures, setOpenFixtures] = useState<number[]>([]);
  const [fixturesData, setFixturesData] = useState<Record<
    string,
    any[]
  > | null>(null);

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

  const placeBet = async (fixtureIndex: number, fixture: any) => {
    const bet = bets[fixtureIndex];

    if (!bet || !bet.option || bet.amount <= 0) {
      alert("Please select an option and enter a valid bet amount.");
      return;
    }

    const betInfo = {
      user_id: user!.id,
      option: bet.option,
      amount: bet.amount,
      multiplier: bet.multiplier,
      potential_win: +(bet.amount * bet.multiplier).toFixed(2),
      teams: {
        host: fixture.host.teamName,
        guest: fixture.guest.teamName,
        hostTeamLogoUrl: fixture.host.imageSrc,
        guestTeamLogoUrl: fixture.guest.imageSrc,
      },
      coefficients: {
        host: fixture.host.winCoefficient,
        draw: fixture.drawCoefficient,
        guest: fixture.guest.winCoefficient,
      },
      result: "unknown",
      week: week!,
    };

    const result = await placeBetInDatabase(betInfo);

    if (result.success) {
      alert(`✅ Bet placed! New balance: ${result.newBalance}`);
      setBets((prev) => {
        const copy = { ...prev };
        delete copy[fixtureIndex];
        return copy;
      });
      window.location.href = "/profile";
    } else {
      alert(`❌ Failed to place bet: ${result.message}`);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await getCurrentLeagueWeek();
      if (res.success && res.currentWeek !== null) {
        setCurrentWeek(res.currentWeek);
        setWeek(res.currentWeek);
      } else {
        console.warn("Could not determine current week:", res.message);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentWeek === null) return;

    (async () => {
      const response = await getFixturesForFrontend();
      if (response.success) {
        setFixturesData(response.data ?? null);
      } else {
        console.error("Failed to load fixtures:", response.message);
      }
    })();
  }, [currentWeek]);

  if (currentWeek === null || week === null || !fixturesData) {
    return <div className="text-font">Loading fixtures...</div>;
  }

  const currentWeekKey = `week_${week}`;
  const fixtures = fixturesData[currentWeekKey] || [];

  const handlePrevious = () => {
    setWeek((prev) => {
      if (prev === null) return prev;
      const newWeek = prev > 1 ? prev - 1 : prev;
      setOpenFixtures([]);
      return newWeek;
    });
  };

  const handleNext = () => {
    setWeek((prev) => {
      if (prev === null) return prev;
      const newWeek = prev < maxWeek ? prev + 1 : prev;
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
          style={{ opacity: week >= maxWeek ? "0" : "1" }}
        >
          Next →
        </button>
      </div>

      <div className={styles.fixtures}>
        {fixtures.map((item, index) => {
          const host = item.host;
          const guest = item.guest;

          if (!host || !guest) return null; // defensive: prevent crash

          const isPlayed =
            typeof host.score === "number" && typeof guest.score === "number";

          return (
            <Fragment key={index}>
              <div className={styles.fixture}>
                <div className={styles.teamInitials + " justify-end"}>
                  <div className={styles.teamLogo}>
                    <Image
                      fill
                      objectFit="contain"
                      alt="team logo"
                      src={host.imageSrc}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className={styles.teamName + " text-font"}>
                      {host.teamName}
                    </p>
                  </div>
                </div>

                {isPlayed ? (
                  <p className={styles.result}>
                    {host.score} : {guest.score}
                  </p>
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
                      {guest.teamName}
                    </p>
                  </div>
                  <div className={styles.teamLogo}>
                    <Image
                      fill
                      objectFit="contain"
                      alt="team logo"
                      src={guest.imageSrc}
                    />
                  </div>
                </div>
              </div>

              {!isPlayed && openFixtures.includes(index) && (
                <div className={styles.betWindow + " text-font"}>
                  <div
                    className={
                      styles.betOption +
                      (bets[index]?.option === "host"
                        ? " " + styles.selected
                        : "")
                    }
                    onClick={() =>
                      handleOptionSelect(index, "host", host.winCoefficient)
                    }
                  >
                    {`${host.teamName} win (${host.winCoefficient}x)`}
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
                      handleOptionSelect(index, "guest", guest.winCoefficient)
                    }
                  >
                    {`${guest.teamName} win (${guest.winCoefficient}x)`}
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
                    {(bets[index]?.amount && bets[index]?.multiplier
                      ? bets[index].amount * bets[index].multiplier
                      : 0
                    ).toFixed(2)}
                  </div>
                  <button
                    className={styles.submitBetBtn + " text-font"}
                    onClick={() => placeBet(index, item)}
                  >
                    Submit
                  </button>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
