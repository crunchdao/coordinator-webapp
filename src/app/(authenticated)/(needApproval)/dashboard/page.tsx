import { Metadata } from "next";
import { CoordinatorCrunches } from "@/modules/coordinator/ui/coordinatorCrunches";
import { StakingCard } from "@/modules/staking/ui/stakingCard";
import { FaucetCard } from "@/modules/faucet/ui/faucetCard";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized dashboard to manage your Coordinator node",
};

export default function DashboardPage() {
  return (
    <div className="p-6 flex flex-wrap max-lg:flex-col gap-3">
      <div className="flex flex-col gap-3 w-full lg:max-w-md">
        <FaucetCard />
        <StakingCard />
      </div>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Your Crunches</CardTitle>
        </CardHeader>
        <CardContent>
          <CoordinatorCrunches />
        </CardContent>
      </Card>
    </div>
  );
}
