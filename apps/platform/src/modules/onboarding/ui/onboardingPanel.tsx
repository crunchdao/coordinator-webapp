"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@crunch-ui/core";
import { ChevronLeft, ChevronRight } from "@crunch-ui/icons";
import { useOnboarding } from "../application/onboardingContext";
import { OnboardingStepper } from "./onboardingStepper";

export function OnboardingPanel() {
  const {
    isLoading,
    isOnboardingComplete,
    currentStepInfo,
    currentStepContent,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
  } = useOnboarding();

  if (isLoading) {
    return null;
  }

  if (isOnboardingComplete) {
    return null;
  }

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
            {currentStepContent}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                disabled={!canGoPrevious}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button onClick={goToNextStep} disabled={!canGoNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
