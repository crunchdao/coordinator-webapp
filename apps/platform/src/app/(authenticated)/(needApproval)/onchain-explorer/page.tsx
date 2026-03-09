import { Metadata } from "next";
import { CoordinatorCrunches } from "@/modules/crunch/ui/coordinatorCrunches";
import {
  DepositedCard,
  RewardCard,
  StakingLifecycle,
  UnstackedCard,
} from "@crunchdao/staking";
import { SelfStakeCard } from "@/modules/staking/ui/selfStakeCard";
import { WalletConnection } from "@/modules/wallet/ui/walletConnection";
import { EnvironmentSwitcher } from "@/modules/environment/ui/environmentSwitcher";

export const metadata: Metadata = {
  title: "Onchain Explorer",
  description: "Explore on-chain state for your Coordinator",
};

export default function OnchainExplorerPage() {
  return (
    <div className="p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Onchain Explorer</h1>
        <div className="flex gap-4 items-center">
          <EnvironmentSwitcher />
          <WalletConnection />
        </div>
      </div>
      <div className="flex [&_div]:flex-1 gap-3 w-full">
        <DepositedCard />
        <UnstackedCard />
        <SelfStakeCard />
        <RewardCard />
      </div>
      <StakingLifecycle />
      <CoordinatorCrunches />
    </div>
  );
}
