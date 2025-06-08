"use client";

import { useEffect, useState } from "react";

export default function DailyRewardToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (document.cookie.includes("dailyReward=true")) {
      setShow(true);

      // Clear the cookie so it doesn't show again
      document.cookie =
        "dailyReward=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#009933",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        fontSize: "1rem",
        zIndex: 1000,
      }}
    >
      ✅ +1 coin
    </div>
  );
}
