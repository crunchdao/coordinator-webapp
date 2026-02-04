"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import * as multisig from "@sqds/multisig";

export type ProposalStatusKind =
  | "Draft"
  | "Active"
  | "Approved"
  | "Executing"
  | "Executed"
  | "Rejected"
  | "Cancelled";

export interface TrackedProposal {
  multisigPda: PublicKey;
  transactionIndex: bigint;
  memo: string;
  proposalUrl?: string;
  signature: string;
  onExecuted?: () => void;
}

export interface ProposalTrackingState {
  proposal: TrackedProposal | null;
  status: ProposalStatusKind | "loading" | "not_found";
  approvals: PublicKey[];
  rejections: PublicKey[];
  threshold: number;
  error: string | null;
}

interface MultisigProposalTrackerContextValue {
  trackingState: ProposalTrackingState;
  trackProposal: (proposal: TrackedProposal) => void;
  dismiss: () => void;
  isTracking: boolean;
}

const initialState: ProposalTrackingState = {
  proposal: null,
  status: "loading",
  approvals: [],
  rejections: [],
  threshold: 0,
  error: null,
};

const MultisigProposalTrackerContext =
  createContext<MultisigProposalTrackerContextValue>({
    trackingState: initialState,
    trackProposal: () => {},
    dismiss: () => {},
    isTracking: false,
  });

const POLL_INTERVAL_MS = 3000;

export const MultisigProposalTrackerProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { connection } = useConnection();
  const [trackingState, setTrackingState] =
    useState<ProposalTrackingState>(initialState);
  const [isTracking, setIsTracking] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExecutedRef = useRef<(() => void) | undefined>(undefined);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    stopPolling();
    setIsTracking(false);
    setTrackingState(initialState);
    onExecutedRef.current = undefined;
  }, [stopPolling]);

  const pollProposal = useCallback(
    async (multisigPda: PublicKey, transactionIndex: bigint) => {
      try {
        // Get proposal PDA
        const [proposalPda] = multisig.getProposalPda({
          multisigPda,
          transactionIndex,
        });

        // Try to fetch the proposal account
        const proposalAccount =
          await multisig.accounts.Proposal.fromAccountAddress(
            connection,
            proposalPda
          );

        const status = proposalAccount.status.__kind as ProposalStatusKind;

        // Get threshold from multisig account
        let threshold = 0;
        try {
          const multisigAccount =
            await multisig.accounts.Multisig.fromAccountAddress(
              connection,
              multisigPda
            );
          threshold = multisigAccount.threshold;
        } catch {
          // Keep previous threshold if fetch fails
        }

        setTrackingState((prev) => ({
          ...prev,
          status,
          approvals: proposalAccount.approved,
          rejections: proposalAccount.rejected,
          threshold,
          error: null,
        }));

        // If executed, call the callback and stop polling
        if (status === "Executed") {
          onExecutedRef.current?.();
          // Small delay to let UI show "Executed" state before auto-dismissing
          setTimeout(() => {
            dismiss();
          }, 2000);
          return true; // Signal to stop polling
        }

        // If rejected or cancelled, stop polling
        if (status === "Rejected" || status === "Cancelled") {
          return true;
        }

        return false;
      } catch (error) {
        // Proposal account might not exist yet (just created)
        setTrackingState((prev) => ({
          ...prev,
          status: "not_found",
          error: null,
        }));
        return false;
      }
    },
    [connection, dismiss]
  );

  const trackProposal = useCallback(
    (proposal: TrackedProposal) => {
      // Stop any existing polling
      stopPolling();

      onExecutedRef.current = proposal.onExecuted;

      setTrackingState({
        proposal,
        status: "loading",
        approvals: [],
        rejections: [],
        threshold: 0,
        error: null,
      });
      setIsTracking(true);

      // Do an immediate poll
      pollProposal(proposal.multisigPda, proposal.transactionIndex);

      // Start polling interval
      pollingRef.current = setInterval(async () => {
        const shouldStop = await pollProposal(
          proposal.multisigPda,
          proposal.transactionIndex
        );
        if (shouldStop) {
          stopPolling();
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling, pollProposal]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return (
    <MultisigProposalTrackerContext.Provider
      value={{ trackingState, trackProposal, dismiss, isTracking }}
    >
      {children}
    </MultisigProposalTrackerContext.Provider>
  );
};

export const useMultisigProposalTracker = () => {
  return useContext(MultisigProposalTrackerContext);
};
