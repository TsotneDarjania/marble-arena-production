import Fixtures from "@/app/components/fixtures/Fixtures";
import LeagueStandings from "./leagueStandings/LeagueStandings";
import MarbleLeagueWinners from "@/app/components/leagueWinners/LeagueWinners";
import VoteSection from "@/app/components/voteSection/VoteSections";

export default function League() {
  return (
    <div>
      <LeagueStandings />
      <Fixtures />
      <MarbleLeagueWinners />
      <VoteSection />
    </div>
  );
}
