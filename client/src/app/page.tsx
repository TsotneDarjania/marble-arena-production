import Hero from "./components/hero/Hero";
import TeamsExhibition from "./components/teamsExhibition/TeamsExhibition";
import Standings from "./components/standings/Standings";
import Leaderboard from "./components/liderboard/Liderboard";
import Features from "./components/features/features";
import BettingFeature from "./components/betFeature/RulesAndStats";
import Stats from "./components/stats/Stats";
import ShadowWrapper from "./components/utils/shadow/shadowWrapper/ShadowWrapper";
import AuthModal from "./components/utils/authModal/AuthModal";
import HeroWrapper from "./components/hero/HeroWrapper";
import { UserType } from "./types/userTypes";

export default function Home({user} : {user: UserType}) {
  return (
    <>
      <HeroWrapper />
      <TeamsExhibition />
      <Standings />
      <Leaderboard/>
      <Features />
      <BettingFeature />
      <Stats />

      <ShadowWrapper />
      <AuthModal />
    </>
  );
}
