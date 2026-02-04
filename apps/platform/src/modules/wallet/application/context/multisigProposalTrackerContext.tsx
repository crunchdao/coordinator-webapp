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
import {
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
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
  onExecuted?: () => void | Promise<void>;
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
  /** Approve the currently tracked proposal. Connected wallet must be a multisig member. */
  approveProposal: () => Promise<void>;
  /** Execute the currently tracked proposal. Only callable when status is Approved. */
  executeProposal: () => Promise<void>;
  /** Whether an approve/execute action is in progress */
  isActing: boolean;
  /** Whether the connected wallet has already approved the proposal */
  hasApproved: boolean;
  /** Whether the connected wallet is a member of the multisig */
  isMember: boolean;
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
    approveProposal: async () => {},
    executeProposal: async () => {},
    isActing: false,
    hasApproved: false,
    isMember: false,
  });

const POLL_INTERVAL_MS = 3000;

export const MultisigProposalTrackerProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const [trackingState, setTrackingState] =
    useState<ProposalTrackingState>(initialState);
  const [isTracking, setIsTracking] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [members, setMembers] = useState<PublicKey[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onExecutedRef = useRef<(() => void | Promise<void>) | undefined>(
    undefined
  );

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    stopPolling();
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
    setIsTracking(false);
    setTrackingState(initialState);
    setMembers([]);
    onExecutedRef.current = undefined;
  }, [stopPolling]);

  const pollProposal = useCallback(
    async (multisigPda: PublicKey, transactionIndex: bigint) => {
      try {
        const [proposalPda] = multisig.getProposalPda({
          multisigPda,
          transactionIndex,
        });

        const proposalAccount =
          await multisig.accounts.Proposal.fromAccountAddress(
            connection,
            proposalPda
          );

        const status = proposalAccount.status.__kind as ProposalStatusKind;

        // Get threshold and members from multisig account
        let threshold = 0;
        try {
          const multisigAccount =
            await multisig.accounts.Multisig.fromAccountAddress(
              connection,
              multisigPda
            );
          threshold = multisigAccount.threshold;
          setMembers(
            (multisigAccount.members as Array<{ key: PublicKey }>).map(
              (member) => member.key
            )
          );
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
          try {
            await onExecutedRef.current?.();
          } catch (e) {
            console.error("[ProposalTracker] onExecuted callback failed:", e);
          }
          // Small delay to let UI show "Executed" state before auto-dismissing
          dismissTimeoutRef.current = setTimeout(() => {
            dismiss();
          }, 2000);
          return true;
        }

        // If rejected or cancelled, stop polling
        if (status === "Rejected" || status === "Cancelled") {
          stopPolling();
          return true;
        }

        return false;
      } catch {
        // Proposal account might not exist yet (just created)
        setTrackingState((prev) => ({
          ...prev,
          status: "not_found",
          error: null,
        }));
        return false;
      }
    },
    [connection, dismiss, stopPolling]
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

  const approveProposal = useCallback(async () => {
    const { proposal } = trackingState;
    if (!proposal || !publicKey || !signTransaction) {
      throw new Error("Cannot approve: no proposal or wallet not connected");
    }

    setIsActing(true);
    try {
      const approveIx = multisig.instructions.proposalApprove({
        multisigPda: proposal.multisigPda,
        transactionIndex: proposal.transactionIndex,
        member: publicKey,
      });

      const tx = new Transaction().add(approveIx);
      tx.feePayer = publicKey;
      tx.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const signedTx = await signTransaction(tx);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");

      // Trigger immediate poll to refresh state
      await pollProposal(proposal.multisigPda, proposal.transactionIndex);
    } catch (error) {
      console.error("[ProposalTracker] Approve failed:", error);
      setTrackingState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Approve failed",
      }));
      throw error;
    } finally {
      setIsActing(false);
    }
  }, [trackingState, publicKey, signTransaction, connection, pollProposal]);

  const executeProposal = useCallback(async () => {
    const { proposal } = trackingState;
    if (!proposal || !publicKey || !signTransaction) {
      throw new Error("Cannot execute: no proposal or wallet not connected");
    }

    setIsActing(true);
    try {
      // Use the SDK helper which resolves remaining accounts automatically
      const { instruction: executeIx, lookupTableAccounts } =
        await multisig.instructions.vaultTransactionExecute({
          connection,
          multisigPda: proposal.multisigPda,
          transactionIndex: proposal.transactionIndex,
          member: publicKey,
        });

      // If there are lookup tables, use VersionedTransaction
      if (lookupTableAccounts.length > 0) {
        const { blockhash } = await connection.getLatestBlockhash();
        const messageV0 = new TransactionMessage({
          payerKey: publicKey,
          recentBlockhash: blockhash,
          instructions: [executeIx],
        }).compileToV0Message(lookupTableAccounts);

        const versionedTx = new VersionedTransaction(messageV0);
        const signedTx = await signTransaction(versionedTx);
        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        await connection.confirmTransaction(signature, "confirmed");
      } else {
        const tx = new Transaction().add(executeIx);
        tx.feePayer = publicKey;
        tx.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        const signedTx = await signTransaction(tx);
        const signature = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        await connection.confirmTransaction(signature, "confirmed");
      }

      // Trigger immediate poll to refresh state (will fire onExecuted)
      await pollProposal(proposal.multisigPda, proposal.transactionIndex);
    } catch (error) {
      console.error("[ProposalTracker] Execute failed:", error);
      setTrackingState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Execute failed",
      }));
      throw error;
    } finally {
      setIsActing(false);
    }
  }, [trackingState, publicKey, signTransaction, connection, pollProposal]);

  // Derived state: has the connected wallet already approved?
  const hasApproved =
    !!publicKey &&
    trackingState.approvals.some((a) => a.equals(publicKey));

  // Derived state: is the connected wallet a multisig member?
  const isMember =
    !!publicKey && members.some((m) => m.equals(publicKey));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [stopPolling]);

  return (
    <MultisigProposalTrackerContext.Provider
      value={{
        trackingState,
        trackProposal,
        dismiss,
        isTracking,
        approveProposal,
        executeProposal,
        isActing,
        hasApproved,
        isMember,
      }}
    >
      {children}
    </MultisigProposalTrackerContext.Provider>
  );
};

export const useMultisigProposalTracker = () => {
  return useContext(MultisigProposalTrackerContext);
};
