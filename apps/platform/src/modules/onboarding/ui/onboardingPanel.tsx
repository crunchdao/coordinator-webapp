"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { useOnboarding } from "../application/context/onboardingContext";
import { OnboardingStepper } from "./onboardingStepper";

interface OnboardingPanelProps {
  children?: React.ReactNode;
}

export function OnboardingPanel({ children }: OnboardingPanelProps) {
  const { currentStep, steps, isLoading, isOnboardingComplete } =
    useOnboarding();

  if (isLoading) {
    return null;
  }

  if (isOnboardingComplete) {
    return null;
  }

  const currentStepInfo = steps.find((s) => s.step === currentStep);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Started</CardTitle>
        <CardDescription>
          In order to deploy your first Crunch, you need to complete the
          following steps:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8">
          <OnboardingStepper />
          <div className="space-y-4">
            {currentStepInfo && (
              <>
                <div>
                  <h3 className="font-semibold">{currentStepInfo.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStepInfo.description}
                  </p>
                </div>
                {currentStepInfo.isBlocked && currentStepInfo.blockReason && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {currentStepInfo.blockReason}
                  </p>
                )}
              </>
            )}
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
