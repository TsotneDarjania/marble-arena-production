// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Audiowide, Courier_Prime } from "next/font/google";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { AppProvider } from "./context/AppContexty";
import { createClient } from "./utils/supabase/server";
import { UserType } from "./types/userTypes";

// Load fonts and assign to CSS variables
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

  if (authError || !user) {
    console.log("Auth error:", authError);
  } else {
    const { data, error: userError } = await supabase
      .from("Users")
      .select("balance, profile_image_url")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.log("User data fetch error:", userError);
    } else {
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
        </AppProvider>
      </body>
    </html>
  );
}
