"use client";

import { OnboardingProvider } from "../application/onboardingContext";
import { OnboardingPanel } from "./onboardingPanel";

export function OnboardingContent() {
  return (
    <OnboardingProvider>
      <OnboardingPanel />
    </OnboardingProvider>
  );
}
