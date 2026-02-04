export enum OnboardingStep {
  CONFIGURE_MULTISIG = "configure_multisig",
  REGISTER_COORDINATOR = "register_coordinator",
  WAITING_APPROVAL = "waiting_approval",
  STAKE = "stake",
  CREATE_CRUNCH = "create_crunch",
  FUND_CRUNCH = "fund_crunch",
  START_CRUNCH = "start_crunch",
  CERTIFICATE_ENROLLMENT = "certificate_enrollment",
  COMPLETED = "completed",
}

export interface OnboardingStepInfo {
  step: OnboardingStep;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  steps: OnboardingStepInfo[];
  isLoading: boolean;
  isOnboardingComplete: boolean;

  isMultisigConfigured: boolean;
  isRegistered: boolean;
  isApproved: boolean;
  isPending: boolean;
  stakedAmount: number;
  minStakeRequired: number;
  hasEnoughStake: boolean;
  hasCrunch: boolean;
  isCrunchFunded: boolean;
  isCrunchStarted: boolean;
  hasCertificate: boolean;

  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}
