"use client";
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useGetCoordinatorCrunches } from "@/modules/crunch/application/hooks/useGetCoordinatorCrunches";
import { useGetStakingInfo } from "@/modules/staking/application/hooks/useGetStakingInfo";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { OnboardingStep, OnboardingStepInfo, OnboardingState } from "../../domain/types";

// TODO: Get from getCoordinatorPoolConfig
const MIN_STAKE_REQUIRED = 0;

interface OnboardingContextType extends OnboardingState {}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

const STEP_CONFIG: Record<OnboardingStep, { title: string; description: string; isOptional: boolean }> = {
  [OnboardingStep.CONFIGURE_MULTISIG]: {
    title: "Configure Multisig",
    description: "Optionally configure a multisig wallet for enhanced security",
    isOptional: true,
  },
  [OnboardingStep.REGISTER_COORDINATOR]: {
    title: "Register as Coordinator",
    description: "Register your organization on-chain",
    isOptional: false,
  },
  [OnboardingStep.WAITING_APPROVAL]: {
    title: "Waiting for Approval",
    description: "Your registration is being reviewed",
    isOptional: false,
  },
  [OnboardingStep.STAKE]: {
    title: "Stake Tokens",
    description: "Stake CRNCH tokens on yourself",
    isOptional: false,
  },
  [OnboardingStep.CREATE_CRUNCH]: {
    title: "Create Crunch",
    description: "Create your first Crunch challenge",
    isOptional: false,
  },
  [OnboardingStep.FUND_CRUNCH]: {
    title: "Fund Crunch",
    description: "Fund your Crunch with USDC rewards",
    isOptional: false,
  },
  [OnboardingStep.START_CRUNCH]: {
    title: "Start Crunch",
    description: "Launch your Crunch to start accepting submissions",
    isOptional: false,
  },
  [OnboardingStep.CERTIFICATE_ENROLLMENT]: {
    title: "Certificate Enrollment",
    description: "Download your TLS certificate to run a node",
    isOptional: false,
  },
  [OnboardingStep.COMPLETED]: {
    title: "Completed",
    description: "Onboarding complete!",
    isOptional: false,
  },
};

const STEP_ORDER = [
  OnboardingStep.CONFIGURE_MULTISIG,
  OnboardingStep.REGISTER_COORDINATOR,
  OnboardingStep.WAITING_APPROVAL,
  OnboardingStep.STAKE,
  OnboardingStep.CREATE_CRUNCH,
  OnboardingStep.FUND_CRUNCH,
  OnboardingStep.START_CRUNCH,
  OnboardingStep.CERTIFICATE_ENROLLMENT,
];

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { coordinatorStatus, isLoading: authLoading } = useAuth();
  const { isMultisigMode } = useWallet();
  const { crunches, crunchesLoading } = useGetCoordinatorCrunches();
  const { stakingInfo, stakingInfoLoading } = useGetStakingInfo();

  const state = useMemo((): OnboardingState => {
    const isMultisigConfigured = isMultisigMode;
    const isRegistered = coordinatorStatus !== CoordinatorStatus.UNREGISTERED;
    const isPending = coordinatorStatus === CoordinatorStatus.PENDING;
    const isApproved = coordinatorStatus === CoordinatorStatus.APPROVED;

    const stakedAmount = stakingInfo?.stakedAmount || 0;
    const hasEnoughStake = stakedAmount > MIN_STAKE_REQUIRED;

    const hasCrunch = (crunches?.length || 0) > 0;
    const firstCrunch = crunches?.[0];
    const isCrunchFunded = firstCrunch?.state === "funded" || firstCrunch?.state === "started";
    const isCrunchStarted = firstCrunch?.state === "started";

    let currentStep: OnboardingStep = OnboardingStep.CONFIGURE_MULTISIG;

    if (!isRegistered) {
      currentStep = OnboardingStep.CONFIGURE_MULTISIG;
    } else if (isPending) {
      currentStep = OnboardingStep.WAITING_APPROVAL;
    } else if (isApproved && !hasEnoughStake) {
      currentStep = OnboardingStep.STAKE;
    } else if (isApproved && hasEnoughStake && !hasCrunch) {
      currentStep = OnboardingStep.CREATE_CRUNCH;
    } else if (hasCrunch && !isCrunchFunded) {
      currentStep = OnboardingStep.FUND_CRUNCH;
    } else if (hasCrunch && isCrunchFunded && !isCrunchStarted) {
      currentStep = OnboardingStep.START_CRUNCH;
    } else if (isCrunchStarted) {
      currentStep = OnboardingStep.CERTIFICATE_ENROLLMENT;
    }

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

    const steps: OnboardingStepInfo[] = STEP_ORDER.map((step) => {
      const config = STEP_CONFIG[step];
      const isCompleted = completionMap[step];
      const isActive = step === currentStep;

      let isBlocked = false;
      let blockReason: string | undefined;

      if (step === OnboardingStep.CREATE_CRUNCH && !hasEnoughStake) {
        isBlocked = true;
        blockReason = `You need to stake at least ${MIN_STAKE_REQUIRED} CRNCH before creating a Crunch`;
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
        isCompleted,
        isActive,
        isBlocked,
        blockReason,
      };
    });

    return {
      currentStep,
      steps,
      isLoading: authLoading || crunchesLoading || stakingInfoLoading,
      isOnboardingComplete: isCrunchStarted,
      isMultisigConfigured,
      isRegistered,
      isApproved,
      isPending,
      stakedAmount,
      minStakeRequired: MIN_STAKE_REQUIRED,
      hasEnoughStake,
      hasCrunch,
      isCrunchFunded,
      isCrunchStarted,
      hasCertificate: false,
    };
  }, [
    coordinatorStatus,
    isMultisigMode,
    crunches,
    stakingInfo,
    authLoading,
    crunchesLoading,
    stakingInfoLoading,
  ]);

  return (
    <OnboardingContext.Provider value={state}>
      {children}
    </OnboardingContext.Provider>
  );
}
