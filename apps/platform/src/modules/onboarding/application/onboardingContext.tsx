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
import { PublicKey } from "@solana/web3.js";
import {
  Check,
  Lock,
  Coordinator,
  Trophy,
  Cube,
  Wallet,
  Rocket,
  Certificate,
} from "@crunch-ui/icons";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useGetCoordinator } from "@/modules/crunch/application/hooks/useGetCoordinator";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";
import { useGetStakingInfo } from "@/modules/staking/application/hooks/useGetStakingInfo";
import { useGetCoordinatorPoolConfig } from "@/modules/staking/application/hooks/useGetCoordinatorPoolConfig";
import { useGetRewardVaultBalance } from "@/modules/crunch/application/hooks/useGetRewardVaultBalance";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { MultisigForm } from "@/modules/wallet/ui/multisigForm";
import { RegistrationForm } from "@/modules/crunch/ui/registrationForm";
import { CrunchCreationForm } from "@/modules/crunch/ui/crunchCreationForm";
import { OnboardingStakeForm } from "../ui/onboardingStakeForm";
import { OnboardingFundCrunchForm } from "../ui/onboardingFundCrunchForm";
import { OnboardingStartCrunchForm } from "../ui/onboardingStartCrunchForm";
import { EnrollForm } from "@/modules/certificate/ui/enrollForm";
import { useCertificateEnrollmentStatus } from "@/modules/certificate/application/hooks/useCertificateEnrollmentStatus";
import { OnboardingCompletedStep } from "../ui/onboardingCompletedStep";
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
    content: <CrunchCreationForm />,
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
    content: <OnboardingStartCrunchForm />,
  },
  [OnboardingStep.CERTIFICATE_ENROLLMENT]: {
    title: "Certificate Enrollment",
    description: "Download your TLS certificate to run a node",
    isOptional: false,
    icon: Certificate,
    content: <EnrollForm showStatus />,
  },
  [OnboardingStep.COMPLETED]: {
    title: "Completed",
    description: "Onboarding complete!",
    isOptional: false,
    icon: Check,
    content: <OnboardingCompletedStep />,
  },
};

export const STEP_ORDER: OnboardingStep[] = [
  OnboardingStep.CONFIGURE_MULTISIG,
  OnboardingStep.REGISTER_COORDINATOR,
  OnboardingStep.STAKE,
  OnboardingStep.CREATE_CRUNCH,
  OnboardingStep.FUND_CRUNCH,
  OnboardingStep.START_CRUNCH,
  OnboardingStep.CERTIFICATE_ENROLLMENT,
  OnboardingStep.COMPLETED,
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
  goToStep: (index: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  maxStepIndex: number;
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
  const { coordinator, coordinatorLoading } = useGetCoordinator();
  const { crunches, crunchesLoading: crunchesLoadingRaw } = useGetCrunches(
    coordinator?.address ? { coordinator: coordinator.address } : undefined
  );
  const crunchesLoading = coordinatorLoading || crunchesLoadingRaw;
  const { stakingInfo, stakingInfoLoading } = useGetStakingInfo();
  const { poolConfig, poolConfigLoading } = useGetCoordinatorPoolConfig();

  const [stepIndex, setStepIndex] = useState(0);
  const hasInitialized = useRef(false);

  const isLoading =
    authLoading || crunchesLoading || stakingInfoLoading || poolConfigLoading;
  const minStakeRequired = poolConfig?.minActivationSelfStake ?? 0;
  const stakedAmount = stakingInfo?.stakedAmount ?? 0;
  const crunchCount = crunches?.length ?? 0;
  const firstCrunch = crunches?.[0];
  const firstCrunchState = firstCrunch?.state?.toLowerCase();

  const rewardVaultPubkey = useMemo(
    () =>
      firstCrunch?.rewardVault
        ? new PublicKey(firstCrunch.rewardVault)
        : undefined,
    [firstCrunch]
  );
  const { vaultBalance } = useGetRewardVaultBalance(rewardVaultPubkey);
  const { enrollmentStatus } = useCertificateEnrollmentStatus();

  const isMultisigConfigured = isMultisigMode;
  const isRegistered = coordinatorStatus !== CoordinatorStatus.UNREGISTERED;
  const isPending = coordinatorStatus === CoordinatorStatus.PENDING;
  const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;
  const hasEnoughStake = stakedAmount >= minStakeRequired;
  const hasCrunch = crunchCount > 0;
  const isCrunchFunded = vaultBalance > 0 || firstCrunchState === "started";
  const isCrunchStarted = firstCrunchState === "started";
  const hasCertificate = enrollmentStatus?.enrolled === true;

  const maxStepIndex = useMemo(() => {
    let max = 1;
    if (isApproved) max = 2;
    if (hasEnoughStake) max = 3;
    if (hasCrunch) max = 4;
    if (isCrunchFunded) max = 5;
    if (isCrunchStarted) max = 6;
    if (hasCertificate) max = 7;
    return max;
  }, [
    isApproved,
    hasEnoughStake,
    hasCrunch,
    isCrunchFunded,
    isCrunchStarted,
    hasCertificate,
  ]);

  const initialStepIndex = useMemo(() => {
    if (hasCertificate) return 7;
    if (isCrunchStarted) return 6;
    if (isCrunchFunded) return 5;
    if (hasCrunch) return 4;
    if (hasEnoughStake) return 3;
    if (isApproved) return 2;
    if (isRegistered) return 1;
    if (isMultisigConfigured) return 1;
    return 0;
  }, [
    isMultisigConfigured,
    isRegistered,
    isApproved,
    hasEnoughStake,
    hasCrunch,
    isCrunchFunded,
    isCrunchStarted,
    hasCertificate,
  ]);

  useEffect(() => {
    if (isLoading || hasInitialized.current) return;
    hasInitialized.current = true;
    setStepIndex(initialStepIndex);
  }, [isLoading, initialStepIndex]);

  const completionMap: Record<OnboardingStep, boolean> = useMemo(
    () => ({
      [OnboardingStep.CONFIGURE_MULTISIG]: isMultisigConfigured,
      [OnboardingStep.REGISTER_COORDINATOR]: isApproved,
      [OnboardingStep.STAKE]: hasEnoughStake,
      [OnboardingStep.CREATE_CRUNCH]: hasCrunch,
      [OnboardingStep.FUND_CRUNCH]: isCrunchFunded,
      [OnboardingStep.START_CRUNCH]: isCrunchStarted,
      [OnboardingStep.CERTIFICATE_ENROLLMENT]: hasCertificate,
      [OnboardingStep.COMPLETED]: false,
    }),
    [
      isMultisigConfigured,
      isApproved,
      hasEnoughStake,
      hasCrunch,
      isCrunchFunded,
      isCrunchStarted,
      hasCertificate,
    ]
  );

  const currentStep = STEP_ORDER[stepIndex] ?? STEP_ORDER[0];
  const isCurrentStepCompleted = completionMap[currentStep];
  const prevCompletedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!hasInitialized.current) return;
    const wasCompleted = prevCompletedRef.current;
    prevCompletedRef.current = isCurrentStepCompleted;

    if (
      wasCompleted === false &&
      isCurrentStepCompleted &&
      stepIndex < maxStepIndex
    ) {
      setStepIndex((i) => i + 1);
    }
  }, [isCurrentStepCompleted, stepIndex, maxStepIndex]);

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

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index <= maxStepIndex) {
        setStepIndex(index);
      }
    },
    [maxStepIndex]
  );

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
    hasCertificate,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoNext,
    canGoPrevious,
    maxStepIndex,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
