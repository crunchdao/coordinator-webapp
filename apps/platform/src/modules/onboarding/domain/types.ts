export enum OnboardingStep {
  CONFIGURE_MULTISIG = "configure_multisig",
  REGISTER_COORDINATOR = "register_coordinator",
  STAKE = "stake",
  CREATE_CRUNCH = "create_crunch",
  FUND_CRUNCH = "fund_crunch",
  START_CRUNCH = "start_crunch",
  CERTIFICATE_ENROLLMENT = "certificate_enrollment",
  COMPLETED = "completed",
}

export interface StepComponentProps {
  onSuccess?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
}

export interface StepConfig {
  title: string;
  description: string;
  isOptional: boolean;
  icon: React.ComponentType<{ className?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
}
