import { Metadata } from "next";
import { CoordinatorCrunches } from "@coordinator/crunch/src/ui/coordinatorCrunches";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";
import {
  DepositedCard,
  RewardCard,
  StakingLifecycle,
  UnstackedCard,
} from "@crunchdao/staking";
import { SelfStakeCard } from "@coordinator/staking/src/ui/selfStakeCard";
import { LocalRestrictedWrapper } from "@coordinator/auth/src/ui/localRestrictedWrapper";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized dashboard to manage your Coordinator node",
};

export default function DashboardPage() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <LocalRestrictedWrapper>
        <div className="flex [&_div]:flex-1 gap-3 w-full">
          <DepositedCard />
          <UnstackedCard />
          <RewardCard />
          <SelfStakeCard />
        </div>
        <StakingLifecycle />
      </LocalRestrictedWrapper>
      <div className="flex flex-wrap max-lg:flex-col gap-3">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Your Crunches</CardTitle>
          </CardHeader>
          <CardContent>
            <CoordinatorCrunches />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
