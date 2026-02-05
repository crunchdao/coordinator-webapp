"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Spinner,
} from "@crunch-ui/core";
import { ChevronLeft, ChevronRight } from "@crunch-ui/icons";
import { useOnboarding } from "../application/onboardingContext";
import { OnboardingStepper } from "./onboardingStepper";

export function OnboardingPanel() {
  const {
    isLoading,
    currentStepInfo,
    currentStepContent,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
  } = useOnboarding();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="w-3xl p-6 mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Get Started</CardTitle>
          <CardDescription className="text-center">
            In order to deploy your first Crunch, you need to complete the
            following steps:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <OnboardingStepper />

            <div className="flex justify-between gap-3 pt-4 mb-3">
              {currentStepInfo && (
                <div>
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
                </div>
              )}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={goToPreviousStep}
                  disabled={!canGoPrevious}
                >
                  <ChevronLeft />
                </Button>
                <Button
                  size="icon-sm"
                  onClick={goToNextStep}
                  disabled={!canGoNext}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>

            {currentStepContent}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
