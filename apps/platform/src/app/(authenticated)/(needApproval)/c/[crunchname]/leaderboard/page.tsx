import { Metadata } from "next";
import { LeaderboardContent } from "@/modules/leaderboard/ui/leaderboardContent";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default function LeaderboardPage() {
  return <LeaderboardContent />;
}
