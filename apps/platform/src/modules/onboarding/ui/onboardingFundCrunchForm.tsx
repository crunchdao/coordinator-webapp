"use client";

import { PublicKey } from "@solana/web3.js";
import { Skeleton } from "@crunch-ui/core";
import { FundCrunchForm } from "@/modules/crunch/ui/fundCrunchForm";
import { useGetCoordinator } from "@/modules/crunch/application/hooks/useGetCoordinator";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";

interface OnboardingFundCrunchFormProps {
  onSuccess?: () => void;
}

export function OnboardingFundCrunchForm({ onSuccess }: OnboardingFundCrunchFormProps) {
  const { coordinator, coordinatorLoading } = useGetCoordinator();
  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator?.address ? { coordinator: coordinator.address } : undefined
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
      onSuccess={onSuccess}
    />
  );
}
