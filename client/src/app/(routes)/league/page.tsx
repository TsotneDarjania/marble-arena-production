import Fixtures from "@/app/components/fixtures/Fixtures";
import LeagueStandings from "./leagueStandings/LeagueStandings";
import MarbleLeagueWinners from "@/app/components/leagueWinners/LeagueWinners";
import VoteSection from "@/app/components/voteSection/VoteSections";
import ShadowWrapper from "@/app/components/utils/shadow/shadowWrapper/ShadowWrapper";
import AuthModal from "@/app/components/utils/authModal/AuthModal";

export default function League() {
  return (
    <div>
      <LeagueStandings />
      <Fixtures />
      {/* <MarbleLeagueWinners /> */}
      <VoteSection />

      {/* <ShadowWrapper />
      <AuthModal /> */}
    </div>
  );
}
