"use client";

import { StakingWrapper } from "@/modules/staking/ui/stakingWrapper";
import { OnboardingProvider } from "../application/onboardingContext";
import { OnboardingPanel } from "./onboardingPanel";

export function OnboardingContent() {
  return (
    <StakingWrapper>
      <OnboardingProvider>
        <OnboardingPanel />
      </OnboardingProvider>
    </StakingWrapper>
  );
}
