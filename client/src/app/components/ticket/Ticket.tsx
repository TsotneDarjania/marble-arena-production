import Image from "next/image";
import styles from "./style.module.css";

type TicketProps = {
  hostTeamName: string;
  guesteamName: string;
  hostScore: number | null;
  guestScore: number | null;
  date: string;
  selectedOption: 0 | 1 | 2;
  isCorrectTicket: boolean | null;
  coinResult: number;
};

export default function Ticket({
  hostTeamName,
  guesteamName,
  hostScore,
  guestScore,
  date,
  selectedOption,
  isCorrectTicket,
  coinResult,
}: TicketProps) {
  const betOptions = [`${hostTeamName} Win`, "Draw", `${guesteamName} Win`];

  // ✅ Match is active if there's no score yet
  const isMatchActive = hostScore === null || guestScore === null;

  return (
    <div className={styles.ticket}>
      <div className={styles.date + " text-font"}>{date}</div>

      <div className={styles.teamInitialsRow + " text-font"}>
        <div className={styles.teamInitials}>
          <div className={styles.teamLogo}>
            <Image
              fill
              objectFit="contain"
              alt="team logo"
              src={`/images/teams/roma.png`}
            />
          </div>
          <p>{hostTeamName}</p>
        </div>

        <div className={styles.scoreResult}>
          <p>{hostScore ?? "-"}</p>
          <p>-</p>
          <p>{guestScore ?? "-"}</p>
        </div>

        <div className={styles.teamInitials}>
          <p>{guesteamName}</p>
          <div className={styles.teamLogo}>
            <Image
              fill
              objectFit="contain"
              alt="team logo"
              src={`/images/teams/inter.png`}
            />
          </div>
        </div>

        {isMatchActive ? (
          <p className={styles.activeResult}>ACTIVE</p>
        ) : isCorrectTicket ? (
          <p className={styles.correctResult}>+{coinResult}</p>
        ) : (
          <p className={styles.wrongResult}>-{coinResult}</p>
        )}
      </div>

      <div className={styles.betOptions + " text-font"}>
        {betOptions.map((label, index) => {
          const isSelected = selectedOption === index;

          let optionClass = styles.betOptionItem;
          if (isMatchActive && isSelected) {
            optionClass += " " + styles.neutralSelectedBetOption;
          } else if (isSelected && isCorrectTicket) {
            optionClass += " " + styles.correctSeletcedBetOption;
          } else if (isSelected && isCorrectTicket === false) {
            optionClass += " " + styles.wrongSeletcedBetOption;
          }

          return (
            <div key={index} className={optionClass}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
