// app/api/reward/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Set short-lived cookie for client toast
  response.cookies.set("dailyReward", "true", {
    path: "/",
    maxAge: 15,
  });

  return response;
}
