"use client";

import {
  Check,
  Lock,
  Coordinator,
  Hourglass,
  Trophy,
  Cube,
  Wallet,
  Rocket,
  Certificate,
} from "@crunch-ui/icons";
import { useOnboarding } from "./onboardingContext";
import { OnboardingStep } from "../domain/types";
import { MultisigForm } from "@/modules/wallet/ui/multisigForm";
import { RegistrationForm } from "@/modules/crunch/ui/registrationForm";

interface StepUI {
  icon: React.ComponentType<{ className?: string }>;
  content?: React.ReactNode;
}

const STEP_UI: Record<OnboardingStep, StepUI> = {
  [OnboardingStep.CONFIGURE_MULTISIG]: {
    icon: Lock,
    content: <MultisigForm showSkip />,
  },
  [OnboardingStep.REGISTER_COORDINATOR]: {
    icon: Coordinator,
    content: <RegistrationForm showSkip />,
  },
  [OnboardingStep.WAITING_APPROVAL]: {
    icon: Hourglass,
  },
  [OnboardingStep.STAKE]: {
    icon: Trophy,
  },
  [OnboardingStep.CREATE_CRUNCH]: {
    icon: Cube,
  },
  [OnboardingStep.FUND_CRUNCH]: {
    icon: Wallet,
  },
  [OnboardingStep.START_CRUNCH]: {
    icon: Rocket,
  },
  [OnboardingStep.CERTIFICATE_ENROLLMENT]: {
    icon: Certificate,
  },
  [OnboardingStep.COMPLETED]: {
    icon: Check,
  },
};

export function useOnboardingSteps() {
  const state = useOnboarding();

  const stepsWithUI = state.steps.map((step) => ({
    ...step,
    ...STEP_UI[step.step],
  }));

  const currentStepUI = STEP_UI[state.currentStep];

  return {
    ...state,
    steps: stepsWithUI,
    currentStepContent: currentStepUI?.content,
  };
}
