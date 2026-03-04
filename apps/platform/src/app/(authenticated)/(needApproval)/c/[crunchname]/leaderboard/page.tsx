import { Metadata } from "next";
import { LeaderboardContent } from "./content";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
