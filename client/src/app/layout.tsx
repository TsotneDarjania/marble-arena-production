import "./globals.css";
import type { Metadata } from "next";
import { Audiowide, Courier_Prime } from "next/font/google";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { AppProvider } from "./context/AppContexty";
import { getUserData } from "./utils/supabase/actions/getUserData";
import Script from "next/script";
import AnalyticsTracker from "./components/analyticsTracker/AnalyticsTracker";

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
  icons: {
    icon: "/favicon.ico", // Add your favicon to /public
  },
  openGraph: {
    title: "Marble Arena",
    description: "Join the ultimate football simulation experience.",
    url: "https://m-arena.com",
    siteName: "Marble Arena",
    images: [
      {
        url: "https://m-arena.com/brand-logo.png", // Add this image to /public
        width: 1200,
        height: 630,
        alt: "Marble Arena OG Image",
      },
    ],
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUserData();

  // if (!authError && user) {
  // const { data, error: userError } = await supabase
  //   .from("Users")
  //   .select("balance, profile_image_url, last_reward_date")
  //   .eq("id", user.id)
  //   .single();

  // if (!userError && data) {
  // const today = new Date().toISOString().slice(0, 10);
  // const needsReward = data.last_reward_date !== today;

  // if (needsReward) {
  //   const { error: updateError } = await supabase
  //     .from("Users")
  //     .update({
  //       balance: data.balance + 1,
  //       last_reward_date: today,
  //     })
  //     .eq("id", user.id);

  //   if (!updateError) {
  //     data.balance += 1;
  //     await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reward`, {
  //       method: "POST",
  //     });
  //   }
  // }

  // userData = {
  //   username: user.user_metadata.displayName,
  //   coins: data.balance,
  //   profileImage: data.profile_image_url,
  //   id: user.id,
  // };
  // }
  // }

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CBPWBNP98C"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-CBPWBNP98C', { page_path: window.location.pathname });
        `}
        </Script>
      </head>

      <body
        className={`${audiowide.variable} ${courierPrime.variable} antialiased layout`}
      >
        <AnalyticsTracker />
        <AppProvider user={userData}>
          <Header />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
