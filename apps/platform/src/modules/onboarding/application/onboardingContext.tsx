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
import { useGetRewardVaultBalance } from "@/modules/crunch/application/hooks/useGetRewardVaultBalance";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { MultisigForm } from "@/modules/wallet/ui/multisigForm";
import { RegistrationForm } from "@/modules/crunch/ui/registrationForm";
import { CrunchCreationForm } from "@/modules/crunch/ui/crunchCreationForm";
import { OnboardingStakeForm } from "../ui/onboardingStakeForm";
import { OnboardingFundCrunchForm } from "../ui/onboardingFundCrunchForm";
import { OnboardingStep, StepConfig } from "../domain/types";

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
    content: <OnboardingStakeForm />,
  },
  [OnboardingStep.CREATE_CRUNCH]: {
    title: "Create Crunch",
    description: "Create your first Crunch challenge",
    isOptional: false,
    icon: Cube,
    content: <CrunchCreationForm onSuccess={() => {}} />,
  },
  [OnboardingStep.FUND_CRUNCH]: {
    title: "Fund Crunch",
    description: "Fund your Crunch with USDC rewards",
    isOptional: false,
    icon: Wallet,
    content: <OnboardingFundCrunchForm />,
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

export interface OnboardingStepInfo extends StepConfig {
  step: OnboardingStep;
  isCompleted: boolean;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
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

  const [stepIndex, setStepIndex] = useState(0);
  const hasInitialized = useRef(false);

  const isLoading = authLoading || crunchesLoading || stakingInfoLoading || poolConfigLoading;
  const minStakeRequired = poolConfig?.minActivationSelfStake ?? 0;
  const stakedAmount = stakingInfo?.stakedAmount ?? 0;
  const crunchCount = crunches?.length ?? 0;
  const firstCrunch = crunches?.[0];
  const firstCrunchState = firstCrunch?.state;

  const { vaultBalance } = useGetRewardVaultBalance(firstCrunch?.rewardVault);

  const isMultisigConfigured = isMultisigMode;
  const isRegistered = coordinatorStatus !== CoordinatorStatus.UNREGISTERED;
  const isPending = coordinatorStatus === CoordinatorStatus.PENDING;
  const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;
  const hasEnoughStake = stakedAmount >= minStakeRequired;
  const hasCrunch = crunchCount > 0;
  const isCrunchFunded = vaultBalance > 0 || firstCrunchState === "started";
  const isCrunchStarted = firstCrunchState === "started";

  const maxStepIndex = useMemo(() => {
    let max = 1;
    if (isRegistered) max = 2;
    if (isApproved) max = 3;
    if (hasEnoughStake) max = 4;
    if (hasCrunch) max = 5;
    if (isCrunchFunded) max = 6;
    if (isCrunchStarted) max = 7;
    return max;
  }, [isRegistered, isApproved, hasEnoughStake, hasCrunch, isCrunchFunded, isCrunchStarted]);

  useEffect(() => {
    if (isLoading || hasInitialized.current) return;
    hasInitialized.current = true;
    setStepIndex(maxStepIndex > 0 ? maxStepIndex : 0);
  }, [isLoading, maxStepIndex]);

  const completionMap: Record<OnboardingStep, boolean> = useMemo(() => ({
    [OnboardingStep.CONFIGURE_MULTISIG]: isMultisigConfigured,
    [OnboardingStep.REGISTER_COORDINATOR]: isRegistered,
    [OnboardingStep.WAITING_APPROVAL]: isApproved,
    [OnboardingStep.STAKE]: hasEnoughStake,
    [OnboardingStep.CREATE_CRUNCH]: hasCrunch,
    [OnboardingStep.FUND_CRUNCH]: isCrunchFunded,
    [OnboardingStep.START_CRUNCH]: isCrunchStarted,
    [OnboardingStep.CERTIFICATE_ENROLLMENT]: false,
    [OnboardingStep.COMPLETED]: false,
  }), [isMultisigConfigured, isRegistered, isApproved, hasEnoughStake, hasCrunch, isCrunchFunded, isCrunchStarted]);

  const steps: OnboardingStepInfo[] = useMemo(() => {
    return STEP_ORDER.map((step, index) => {
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
        ...config,
        isCompleted,
        isActive,
        isBlocked,
        blockReason,
      };
    });
  }, [completionMap, stepIndex, hasEnoughStake, minStakeRequired, isApproved]);

  const currentStep = STEP_ORDER[stepIndex] ?? STEP_ORDER[0];
  const currentStepInfo = steps.find((s) => s.step === currentStep);
  const currentStepContent = currentStepInfo?.content;

  const canGoNext = stepIndex < maxStepIndex;
  const canGoPrevious = stepIndex > 0;

  const goToNextStep = useCallback(() => {
    if (canGoNext) setStepIndex((i) => i + 1);
  }, [canGoNext]);

  const goToPreviousStep = useCallback(() => {
    if (canGoPrevious) setStepIndex((i) => i - 1);
  }, [canGoPrevious]);

  const value: OnboardingState = {
    currentStep,
    currentStepInfo,
    currentStepContent,
    steps,
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
