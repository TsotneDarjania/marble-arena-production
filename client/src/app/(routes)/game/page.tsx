"use client";

import { useSearchParams } from "next/navigation";

export default function GamePage() {
  const searchParams = useSearchParams();
  const host = searchParams.get("host");
  const guest = searchParams.get("guest");

  const query = `?host=${host}&guest=${guest}`;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: "1001",
        top: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <iframe
        src={`https://marble-arena-production-game.vercel.app/${query}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allowFullScreen
      />
    </div>
  );
}
