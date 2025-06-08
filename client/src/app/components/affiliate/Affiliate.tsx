"use client";

import style from "./style.module.css";

export default function Affiliate() {
  return (
    <div
      className={style.affiliate}
      onClick={() => {
        window.open("https://stake.com/?c=VvBWG18G");
      }}
    >
      <h2>More Games</h2>
    </div>
  );
}
