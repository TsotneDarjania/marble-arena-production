import styles from "./style.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <div className=" w-[40%]">
        <h1 className={styles.title + " text-font"}>Marble Arena</h1>
        <p className={styles.text + " text-font"}>
          Where the world's best football teams become marbles and battle it out
          in fast-paced, action-packed simulations! Powered by real-world
          rankings.
        </p>
        <button className={styles.betButton + " text-font"} type="button">
          {" "}
          Place Bet
        </button>
      </div>

      <video
        className={styles.video}
        src="/video/background.mp4"
        muted
        autoPlay
        loop
      />
    </div>
  );
}
