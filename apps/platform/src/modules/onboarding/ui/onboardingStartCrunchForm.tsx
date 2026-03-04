"use client";

import { PublicKey } from "@solana/web3.js";
import { Skeleton } from "@crunch-ui/core";
import { StartCrunchForm } from "@/modules/crunch/ui/startCrunchForm";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";

interface OnboardingStartCrunchFormProps {
  onSuccess?: () => void;
}

export function OnboardingStartCrunchForm({ onSuccess }: OnboardingStartCrunchFormProps) {
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
    <StartCrunchForm
      crunchName={firstCrunch.name}
      crunchAddress={new PublicKey(firstCrunch.address)}
      currentState={firstCrunch.state?.toLowerCase() ?? "unknown"}
      showCrunchInfo
      onSuccess={onSuccess}
    />
  );
}
