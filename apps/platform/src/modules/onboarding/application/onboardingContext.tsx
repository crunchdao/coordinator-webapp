"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
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
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useGetCoordinatorCrunches } from "@/modules/crunch/application/hooks/useGetCoordinatorCrunches";
import { useGetStakingInfo } from "@/modules/staking/application/hooks/useGetStakingInfo";
import { useGetCoordinatorPoolConfig } from "@/modules/staking/application/hooks/useGetCoordinatorPoolConfig";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { MultisigForm } from "@/modules/wallet/ui/multisigForm";
import { RegistrationForm } from "@/modules/crunch/ui/registrationForm";
import { StepConfig, OnboardingStep } from "../domain/types";

const STEPS_CONFIG: Record<OnboardingStep, StepConfig> = {
  [OnboardingStep.CONFIGURE_MULTISIG]: {
    title: "Configure Multisig",
    description: "Optionally configure a multisig wallet for enhanced security",
    isOptional: true,
    icon: Lock,
    content: <MultisigForm />,
  },
  [OnboardingStep.REGISTER_COORDINATOR]: {
    title: "Register as Coordinator",
    description: "Register your organization on-chain",
    isOptional: false,
    icon: Coordinator,
    content: <RegistrationForm />,
  },
  [OnboardingStep.WAITING_APPROVAL]: {
    title: "Waiting for Approval",
    description: "Your registration is being reviewed",
    isOptional: false,
    icon: Hourglass,
  },
  [OnboardingStep.STAKE]: {
    title: "Stake Tokens",
    description: "Stake CRNCH tokens on yourself",
    isOptional: false,
    icon: Trophy,
  },
  [OnboardingStep.CREATE_CRUNCH]: {
    title: "Create Crunch",
    description: "Create your first Crunch challenge",
    isOptional: false,
    icon: Cube,
  },
  [OnboardingStep.FUND_CRUNCH]: {
    title: "Fund Crunch",
    description: "Fund your Crunch with USDC rewards",
    isOptional: false,
    icon: Wallet,
  },
  [OnboardingStep.START_CRUNCH]: {
    title: "Start Crunch",
    description: "Launch your Crunch to start accepting submissions",
    isOptional: false,
    icon: Rocket,
  },
  [OnboardingStep.CERTIFICATE_ENROLLMENT]: {
    title: "Certificate Enrollment",
    description: "Download your TLS certificate to run a node",
    isOptional: false,
    icon: Certificate,
  },
  [OnboardingStep.COMPLETED]: {
    title: "Completed",
    description: "Onboarding complete!",
    isOptional: false,
    icon: Check,
  },
};

export const STEP_ORDER: OnboardingStep[] = [
  OnboardingStep.CONFIGURE_MULTISIG,
  OnboardingStep.REGISTER_COORDINATOR,
  OnboardingStep.WAITING_APPROVAL,
  OnboardingStep.STAKE,
  OnboardingStep.CREATE_CRUNCH,
  OnboardingStep.FUND_CRUNCH,
  OnboardingStep.START_CRUNCH,
  OnboardingStep.CERTIFICATE_ENROLLMENT,
];

export interface OnboardingStepInfo {
  step: OnboardingStep;
  title: string;
  description: string;
  isOptional: boolean;
  isCompleted: boolean;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
  icon: React.ComponentType<{ className?: string }>;
  content?: React.ReactNode;
}

export interface OnboardingState {
  currentStep: OnboardingStep;
  currentStepInfo: OnboardingStepInfo | undefined;
  currentStepContent: React.ReactNode | undefined;
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

const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { coordinatorStatus, isLoading: authLoading } = useAuth();
  const { isMultisigMode } = useWallet();
  const { crunches, crunchesLoading } = useGetCoordinatorCrunches();
  const { stakingInfo, stakingInfoLoading } = useGetStakingInfo();
  const { poolConfig, poolConfigLoading } = useGetCoordinatorPoolConfig();

  const minStakeRequired = poolConfig?.minActivationSelfStake ?? 0;
  const stakedAmount = stakingInfo?.stakedAmount ?? 0;
  const crunchCount = crunches?.length ?? 0;
  const firstCrunchState = crunches?.[0]?.state;

  const [stepIndex, setStepIndex] = useState(0);
  const hasInitialized = useRef(false);

  const isLoading = authLoading || crunchesLoading || stakingInfoLoading || poolConfigLoading;

  useEffect(() => {
    if (isLoading || hasInitialized.current) return;
    hasInitialized.current = true;

    const isRegistered = coordinatorStatus !== CoordinatorStatus.UNREGISTERED;
    const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;
    const hasEnoughStake = stakedAmount >= minStakeRequired;
    const hasCrunch = crunchCount > 0;
    const isCrunchFunded = firstCrunchState === "funded" || firstCrunchState === "started";
    const isCrunchStarted = firstCrunchState === "started";

    let initialIndex = 0;
    if (isMultisigMode) initialIndex = 1;
    if (isRegistered) initialIndex = 2;
    if (isApproved) initialIndex = 3;
    if (hasEnoughStake) initialIndex = 4;
    if (hasCrunch) initialIndex = 5;
    if (isCrunchFunded) initialIndex = 6;
    if (isCrunchStarted) initialIndex = 7;

    setStepIndex(initialIndex);
  }, [
    isLoading,
    coordinatorStatus,
    isMultisigMode,
    stakedAmount,
    minStakeRequired,
    crunchCount,
    firstCrunchState,
  ]);

  const state = useMemo((): Omit<
    OnboardingState,
    "goToNextStep" | "goToPreviousStep" | "canGoNext" | "canGoPrevious"
  > & { maxStepIndex: number } => {
    const isMultisigConfigured = isMultisigMode;
    const isRegistered = coordinatorStatus !== CoordinatorStatus.UNREGISTERED;
    const isPending = coordinatorStatus === CoordinatorStatus.PENDING;
    const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;
    const hasEnoughStake = stakedAmount >= minStakeRequired;
    const hasCrunch = crunchCount > 0;
    const isCrunchFunded =
      firstCrunchState === "funded" || firstCrunchState === "started";
    const isCrunchStarted = firstCrunchState === "started";

    let maxStepIndex = 1;
    if (isRegistered) maxStepIndex = 2;
    if (isApproved) maxStepIndex = 3;
    if (hasEnoughStake) maxStepIndex = 4;
    if (hasCrunch) maxStepIndex = 5;
    if (isCrunchFunded) maxStepIndex = 6;
    if (isCrunchStarted) maxStepIndex = 7;

    const completionMap: Record<OnboardingStep, boolean> = {
      [OnboardingStep.CONFIGURE_MULTISIG]: isMultisigConfigured,
      [OnboardingStep.REGISTER_COORDINATOR]: isRegistered,
      [OnboardingStep.WAITING_APPROVAL]: isApproved,
      [OnboardingStep.STAKE]: hasEnoughStake,
      [OnboardingStep.CREATE_CRUNCH]: hasCrunch,
      [OnboardingStep.FUND_CRUNCH]: isCrunchFunded,
      [OnboardingStep.START_CRUNCH]: isCrunchStarted,
      [OnboardingStep.CERTIFICATE_ENROLLMENT]: false,
      [OnboardingStep.COMPLETED]: false,
    };

    const currentStep = STEP_ORDER[stepIndex] ?? STEP_ORDER[0];

    const steps: OnboardingStepInfo[] = STEP_ORDER.map((step, index) => {
      const config = STEPS_CONFIG[step];
      const isCompleted = completionMap[step];
      const isActive = index === stepIndex;

      let isBlocked = false;
      let blockReason: string | undefined;

      if (step === OnboardingStep.CREATE_CRUNCH && !hasEnoughStake) {
        isBlocked = true;
        blockReason = `You need to stake at least ${minStakeRequired.toLocaleString()} CRNCH before creating a Crunch`;
      }

      if (step === OnboardingStep.STAKE && !isApproved) {
        isBlocked = true;
        blockReason = "You need to be approved before staking";
      }

      return {
        step,
        title: config.title,
        description: config.description,
        isOptional: config.isOptional,
        icon: config.icon,
        content: config.content,
        isCompleted,
        isActive,
        isBlocked,
        blockReason,
      };
    });

    const currentStepInfo = steps.find((s) => s.step === currentStep);

    return {
      currentStep,
      currentStepInfo,
      currentStepContent: currentStepInfo?.content,
      steps,
      maxStepIndex,
      isLoading,
      isOnboardingComplete: isCrunchStarted,
      isMultisigConfigured,
      isRegistered,
      isApproved,
      isPending,
      stakedAmount,
      minStakeRequired,
      hasEnoughStake,
      hasCrunch,
      isCrunchFunded,
      isCrunchStarted,
      hasCertificate: false,
    };
  }, [
    coordinatorStatus,
    isMultisigMode,
    stakedAmount,
    minStakeRequired,
    crunchCount,
    firstCrunchState,
    authLoading,
    crunchesLoading,
    stakingInfoLoading,
    poolConfigLoading,
    stepIndex,
  ]);

  const canGoNext = stepIndex < state.maxStepIndex;
  const canGoPrevious = stepIndex > 0;

  const goToNextStep = useCallback(() => {
    if (canGoNext) setStepIndex((i) => i + 1);
  }, [canGoNext]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) setStepIndex((i) => i - 1);
  }, [canGoPrevious]);

  const value: OnboardingState = {
    ...state,
    goToNextStep,
    goToPreviousStep,
    canGoNext,
    canGoPrevious,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
