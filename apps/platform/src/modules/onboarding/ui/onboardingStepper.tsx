"use client";

import { cn } from "@crunch-ui/utils";
import { Check } from "@crunch-ui/icons";
import { useOnboarding } from "../application/context/onboardingContext";

export function OnboardingStepper() {
  const { steps } = useOnboarding();

  return (
    <div className="flex flex-row gap-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.step} className="flex gap-3">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                  step.isCompleted &&
                    "bg-primary border-primary text-primary-foreground",
                  step.isActive &&
                    !step.isCompleted &&
                    "border-primary text-primary",
                  !step.isActive &&
                    !step.isCompleted &&
                    "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {step.isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-8 h-0.5 mt-1",
                    step.isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  step.isActive && "text-foreground",
                  step.isCompleted && "text-muted-foreground",
                  !step.isActive &&
                    !step.isCompleted &&
                    "text-muted-foreground/50"
                )}
              >
                {step.title}
                {step.isOptional && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    (optional)
                  </span>
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
