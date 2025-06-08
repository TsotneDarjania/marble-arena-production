import "./globals.css";
import type { Metadata } from "next";
import { Audiowide, Courier_Prime } from "next/font/google";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { AppProvider } from "./context/AppContexty";
import { createClient } from "./utils/supabase/server";
import { UserType } from "./types/userTypes";
import DailyRewardToast from "./components/dailyRewardToast/DayliRewardToast";

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-audiowide",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "Marble Arena",
  description: "Football simulation game",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  let userData: UserType = null;

  if (!authError && user) {
    const { data, error: userError } = await supabase
      .from("Users")
      .select("balance, profile_image_url, last_reward_date")
      .eq("id", user.id)
      .single();

    if (!userError && data) {
      const today = new Date().toISOString().slice(0, 10);
      const needsReward = data.last_reward_date !== today;

      if (needsReward) {
        const { error: updateError } = await supabase
          .from("Users")
          .update({
            balance: data.balance + 1,
            last_reward_date: today,
          })
          .eq("id", user.id);

        if (!updateError) {
          data.balance += 1;
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reward`, {
            method: "POST",
          });
        }
      }

      userData = {
        username: user.user_metadata.displayName,
        coins: data.balance,
        profileImage: data.profile_image_url,
        id: user.id,
      };
    }
  }

  return (
    <html lang="en">
      <body
        className={`${audiowide.variable} ${courierPrime.variable} antialiased layout`}
      >
        <AppProvider user={userData}>
          <Header />
          {children}
          <Footer />
          <DailyRewardToast />
        </AppProvider>
      </body>
    </html>
  );
}
