"use client";

import { useMemo } from "react";
import { Skeleton } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchAccountServiceWithContext,
} from "@crunchdao/sdk";
import { StartCrunchForm } from "@/modules/crunch/ui/startCrunchForm";
import { useGetCoordinatorCrunches } from "@/modules/crunch/application/hooks/useGetCoordinatorCrunches";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";

export function OnboardingStartCrunchForm() {
  const { crunches, crunchesLoading } = useGetCoordinatorCrunches();
  const { anchorProvider } = useAnchorProvider();

  const firstCrunch = crunches?.[0];

  const crunchAddress = useMemo(() => {
    if (!firstCrunch || !anchorProvider) return null;
    const coordinatorProgram = getCoordinatorProgram(anchorProvider);
    const crunchAccountService = CrunchAccountServiceWithContext({
      program: coordinatorProgram,
    });
    return crunchAccountService.getCrunchAddress(firstCrunch.name);
  }, [firstCrunch, anchorProvider]);

  if (crunchesLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!firstCrunch || !crunchAddress) {
    return (
      <p className="text-sm text-muted-foreground">
        No crunch found. Please create a crunch first.
      </p>
    );
  }

  return (
    <StartCrunchForm
      crunchName={firstCrunch.name}
      crunchAddress={crunchAddress}
      currentState={firstCrunch.state ?? "unknown"}
      showCrunchInfo
    />
  );
}
