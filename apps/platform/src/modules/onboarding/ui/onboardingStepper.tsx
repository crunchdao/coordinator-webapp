"use client";

import { cn } from "@crunch-ui/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@crunch-ui/core";
import { Check } from "@crunch-ui/icons";
import { useOnboarding } from "../application/onboardingContext";

export function OnboardingStepper() {
  const { steps, goToStep, maxStepIndex } = useOnboarding();

  return (
    <div className="flex flex-row gap-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const Icon = step.icon;
        const isClickable = index <= maxStepIndex;

        const stateClasses =
          step.isCompleted && !step.isActive
            ? "border-success text-success-foreground"
            : step.isActive && !step.isCompleted
            ? "bg-primary border-primary text-primary-foreground"
            : step.isActive && step.isCompleted
            ? "bg-success border-success"
            : "border-muted-foreground/30 text-muted-foreground/50";

        return (
          <div key={step.step} className="flex gap-3 mx-auto">
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => isClickable && goToStep(index)}
                    disabled={!isClickable}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-transform",
                      stateClasses,
                      isClickable
                        ? "cursor-pointer hover:scale-110"
                        : "cursor-not-allowed"
                    )}
                  >
                    <Icon />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{step.title}</TooltipContent>
              </Tooltip>
              {!isLast && (
                <div
                  className={cn(
                    "ml-2 w-8 h-0.5 mt-1",
                    step.isCompleted ? "bg-success" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
