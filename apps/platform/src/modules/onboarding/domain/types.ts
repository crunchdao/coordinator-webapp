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

export interface StepConfig {
  title: string;
  description: string;
  isOptional: boolean;
  icon: React.ComponentType<{ className?: string }>;
  content?: React.ReactNode;
}
