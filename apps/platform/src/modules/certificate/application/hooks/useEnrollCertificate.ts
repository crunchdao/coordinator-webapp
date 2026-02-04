import { useMutation } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { TransactionInstruction, PublicKey } from "@solana/web3.js";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import {
  CertificateData,
  SignedMessage,
  EnrollmentResult,
} from "../../domain/types";
import {
  createCertificateZip,
  downloadBlob,
} from "../utils/createZip";

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Memo program ID
const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

function createMemoInstruction(
  message: string,
  signer: PublicKey
): TransactionInstruction {
  return new TransactionInstruction({
    keys: [{ pubkey: signer, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(message, "utf-8"),
  });
}

type EnrollmentStep =
  | "idle"
  | "generating"
  | "fetching_hotkey"
  | "signing"
  | "proposing"
  | "downloading"
  | "complete";

export interface MultisigEnrollmentResult {
  certificateData: CertificateData;
  isMultisig: true;
  proposalUrl?: string;
  signature: string;
}

export type EnrollmentResultExtended = EnrollmentResult | MultisigEnrollmentResult;

export const useEnrollCertificate = () => {
  const { publicKey, signMessage } = useWallet();
  const { executeTransaction, authority, isMultisigMode } = useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();

  const mutation = useMutation({
    mutationFn: async (): Promise<EnrollmentResultExtended> => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!authority) {
        throw new Error("Authority not available");
      }

      const certResponse = await fetch("/api/certificate/generate", {
        method: "POST",
      });

      if (!certResponse.ok) {
        const error = await certResponse.json();
        throw new Error(error.error || "Failed to generate certificate");
      }

      const certificateData: CertificateData = await certResponse.json();

      // Use the effective authority (multisig vault or wallet) for hotkey lookup
      const authorityAddress = authority.toBase58();
      const hotkeyResponse = await fetch(
        `/api/certificate/hotkey?wallet=${encodeURIComponent(authorityAddress)}`
      );

      if (!hotkeyResponse.ok) {
        const error = await hotkeyResponse.json();
        throw new Error(error.error || "Failed to fetch hotkey");
      }

      const { hotkey } = await hotkeyResponse.json();

      const message = JSON.stringify({
        cert_pub: certificateData.certPub,
        hotkey: hotkey,
      });

      // Multisig mode: create a memo transaction and propose it
      if (isMultisigMode) {
        const memoInstruction = createMemoInstruction(message, authority);

        const enrollMemo = `Certificate enrollment for hotkey: ${hotkey.slice(0, 8)}...`;
        const result = await executeTransaction({
          instructions: [memoInstruction],
          memo: enrollMemo,
        });

        // Track the multisig proposal so the countdown dialog appears
        if (result.isMultisig && result.transactionIndex && result.multisigPda) {
          trackProposal({
            multisigPda: result.multisigPda,
            transactionIndex: result.transactionIndex,
            memo: enrollMemo,
            proposalUrl: result.proposalUrl,
            signature: result.signature,
          });
        }

        // In multisig mode, we download the certificate but without a signature
        // The on-chain memo transaction serves as the attestation once approved
        const zipBlob = await createCertificateZip(certificateData, {
          message_b64: uint8ArrayToBase64(new TextEncoder().encode(message)),
          wallet_pubkey_b58: authorityAddress,
          signature_b64: "", // No signature in multisig mode - attestation is on-chain
        });
        downloadBlob(zipBlob, "issued-certificate.zip");

        return {
          certificateData,
          isMultisig: true,
          proposalUrl: result.proposalUrl,
          signature: result.signature,
        };
      }

      // Direct mode: sign the message with the wallet
      if (!signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);

      const signedMessage: SignedMessage = {
        message_b64: uint8ArrayToBase64(messageBytes),
        wallet_pubkey_b58: authorityAddress,
        signature_b64: uint8ArrayToBase64(signature),
      };

      const zipBlob = await createCertificateZip(certificateData, signedMessage);
      downloadBlob(zipBlob, "issued-certificate.zip");

      return {
        certificateData,
        signedMessage,
      };
    },
    onSuccess: (result) => {
      if ("isMultisig" in result && result.isMultisig) {
        toast({
          title: "Multisig proposal created",
          description:
            "Certificate files downloaded. The enrollment transaction has been submitted for multisig approval.",
        });
      } else {
        toast({
          title: "Certificate enrolled successfully",
          description: "Your certificate files have been downloaded.",
        });
      }
    },
    onError: (error) => {
      console.error("Certificate enrollment error:", error);
      toast({
        title: "Failed to enroll certificate",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const getStep = (): EnrollmentStep => {
    if (!mutation.isPending) {
      return mutation.isSuccess ? "complete" : "idle";
    }
    return "generating";
  };

  return {
    enroll: mutation.mutate,
    enrollAsync: mutation.mutateAsync,
    isEnrolling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    step: getStep(),
    reset: mutation.reset,
    isMultisigMode,
    data: mutation.data,
  };
};
