import Fixtures from "@/app/components/fixtures/Fixtures";
import LeagueStandings from "./leagueStandings/LeagueStandings";

export default function League() {
  return (
    <div>
      <LeagueStandings />
      <Fixtures />
    </div>
  );
}
