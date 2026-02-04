"use client";

import { OnboardingProvider } from "../application/onboardingContext";
import { OnboardingPanel } from "./onboardingPanel";

export function OnboardingContent() {
  return (
    <OnboardingProvider>
      <section className="w-3xl p-6 mx-auto">
        <OnboardingPanel />
      </section>
    </OnboardingProvider>
  );
}
