"use client";

import { PublicKey } from "@solana/web3.js";
import { Skeleton } from "@crunch-ui/core";
import { FundCrunchForm } from "@/modules/crunch/ui/fundCrunchForm";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useGetCoordinatorCpi } from "@/modules/crunch/application/hooks/useGetCoordinatorCpi";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";

export function OnboardingFundCrunchForm() {
  const { authority } = useEffectiveAuthority();
  const { coordinator, coordinatorLoading } = useGetCoordinatorCpi(
    authority?.toString()
  );
  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator ? { coordinator: coordinator.address } : undefined
  );

  const firstCrunch = crunches[0];

  if (coordinatorLoading || crunchesLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!firstCrunch) {
    return (
      <p className="text-sm text-muted-foreground">
        No crunch found. Please create a crunch first.
      </p>
    );
  }

  return (
    <FundCrunchForm
      crunchName={firstCrunch.name}
      crunchAddress={new PublicKey(firstCrunch.address)}
      rewardVault={new PublicKey(firstCrunch.rewardVault)}
      showCrunchInfo
    />
  );
}
