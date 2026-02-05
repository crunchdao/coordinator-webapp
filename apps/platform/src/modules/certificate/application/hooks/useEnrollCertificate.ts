import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { PublicKey } from "@solana/web3.js";
import {
  getCoordinatorProgram,
  getCoordinatorCertificate,
  setCoordinatorCertificateInstruction,
} from "@crunchdao/sdk";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import {
  CertificateData,
  SignedMessage,
  EnrollmentResult,
} from "../../domain/types";
import { createCertificateZip, downloadBlob } from "../utils/createZip";

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compute SHA-256 hash of the certificate public key (DER format)
 * Returns the hash as an array of numbers (32 bytes)
 */
async function computeCertHash(certPubB64: string): Promise<number[]> {
  const certPubDer = base64ToUint8Array(certPubB64);
  // Create a new ArrayBuffer to satisfy TypeScript's BufferSource type
  const buffer = new Uint8Array(certPubDer).buffer as ArrayBuffer;
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer));
}

/**
 * Check if a certificate hash is empty (all zeros)
 */
function isEmptyHash(hash: number[]): boolean {
  return hash.every((byte) => byte === 0);
}

/**
 * Determine which slot to use for certificate rotation
 * - If no certificate exists → slot 0 (primary)
 * - If certificate exists and secondary is empty → slot 1 (secondary)
 * - If both are filled → overwrite the oldest one
 */
async function determineSlot(
  coordinatorProgram: ReturnType<typeof getCoordinatorProgram>,
  authority: PublicKey
): Promise<number> {
  const cert = await getCoordinatorCertificate(coordinatorProgram, authority);

  // No certificate exists → use slot 0 (primary)
  if (!cert) {
    return 0;
  }

  // Secondary slot is empty → use slot 1
  if (isEmptyHash(cert.certHashSecondary)) {
    return 1;
  }

  // Both filled → overwrite the oldest one
  const primaryUpdated = cert.primaryUpdatedAt.toNumber();
  const secondaryUpdated = cert.secondaryUpdatedAt.toNumber();

  return primaryUpdated <= secondaryUpdated ? 0 : 1;
}

type EnrollmentStep =
  | "idle"
  | "generating"
  | "determining_slot"
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

export type EnrollmentResultExtended =
  | EnrollmentResult
  | MultisigEnrollmentResult;

export const useEnrollCertificate = () => {
  const { publicKey } = useWallet();
  const { anchorProvider } = useAnchorProvider();
  const { executeTransaction, authority, isMultisigMode } =
    useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const queryClient = useQueryClient();

  // Store pending certificate data for multisig mode so we can
  // download the ZIP after the proposal is executed
  const pendingCertRef = useRef<{
    certificateData: CertificateData;
    authorityAddress: string;
  } | null>(null);

  const mutation = useMutation({
    mutationFn: async (): Promise<EnrollmentResultExtended> => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!authority) {
        throw new Error("Authority not available");
      }

      if (!anchorProvider) {
        throw new Error("Anchor provider not available");
      }

      // Generate certificate
      const certResponse = await fetch("/api/certificate/generate", {
        method: "POST",
      });

      if (!certResponse.ok) {
        const error = await certResponse.json();
        throw new Error(error.error || "Failed to generate certificate");
      }

      const certificateData: CertificateData = await certResponse.json();

      // Compute SHA-256 hash of the certificate public key (DER format)
      const certHash = await computeCertHash(certificateData.certPub);

      // Get coordinator program and determine which slot to use
      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const slot = await determineSlot(coordinatorProgram, authority);

      // Create the setCoordinatorCertificate instruction
      const setCertInstruction = await setCoordinatorCertificateInstruction(
        coordinatorProgram,
        authority,
        certHash,
        slot
      );

      const authorityAddress = authority.toBase58();
      const enrollMemo = `Certificate enrollment (slot ${slot})`;

      // Execute the transaction (works for both direct and multisig modes)
      const result = await executeTransaction({
        instructions: [setCertInstruction],
        memo: enrollMemo,
      });

      // Multisig mode: track proposal and download ZIP after execution
      if (result.isMultisig && result.transactionIndex && result.multisigPda) {
        // Store cert data so we can download the ZIP after execution
        pendingCertRef.current = {
          certificateData,
          authorityAddress,
        };

        // Track the multisig proposal so the countdown dialog appears
        trackProposal({
          multisigPda: result.multisigPda,
          transactionIndex: result.transactionIndex,
          memo: enrollMemo,
          proposalUrl: result.proposalUrl,
          signature: result.signature,
          onExecuted: async () => {
            try {
              const pending = pendingCertRef.current;
              if (!pending) {
                console.warn(
                  "[EnrollCertificate] onExecuted but no pending cert data"
                );
                return;
              }

              // For multisig, the on-chain certificate is now set
              // Download the ZIP with transaction info
              const signedMessage: SignedMessage = {
                message_b64: uint8ArrayToBase64(
                  new TextEncoder().encode(
                    JSON.stringify({ cert_pub: pending.certificateData.certPub })
                  )
                ),
                wallet_pubkey_b58: pending.authorityAddress,
                signature_b64: result.signature,
              };

              const zipBlob = await createCertificateZip(
                pending.certificateData,
                signedMessage
              );
              downloadBlob(zipBlob, "issued-certificate.zip");

              // Invalidate the enrollment status query to refresh the UI
              queryClient.invalidateQueries({
                queryKey: ["certificate-enrollment-status"],
              });

              toast({
                title: "Certificate downloaded",
                description:
                  "Certificate ZIP has been downloaded. Your certificate is now registered on-chain.",
              });
            } catch (error) {
              console.error(
                "[EnrollCertificate] Failed to download certificate after execution:",
                error
              );
              toast({
                title: "Failed to download certificate",
                description:
                  error instanceof Error
                    ? error.message
                    : "An error occurred while downloading the certificate.",
                variant: "destructive",
              });
            } finally {
              pendingCertRef.current = null;
            }
          },
        });

        return {
          certificateData,
          isMultisig: true,
          proposalUrl: result.proposalUrl,
          signature: result.signature,
        };
      }

      // Direct mode: transaction is already executed, download the ZIP
      const signedMessage: SignedMessage = {
        message_b64: uint8ArrayToBase64(
          new TextEncoder().encode(
            JSON.stringify({ cert_pub: certificateData.certPub })
          )
        ),
        wallet_pubkey_b58: authorityAddress,
        signature_b64: result.signature,
      };

      const zipBlob = await createCertificateZip(certificateData, signedMessage);
      downloadBlob(zipBlob, "issued-certificate.zip");

      return {
        certificateData,
        signedMessage,
      };
    },
    onSuccess: (result) => {
      // Invalidate the enrollment status query to refresh the UI
      queryClient.invalidateQueries({
        queryKey: ["certificate-enrollment-status"],
      });

      if ("isMultisig" in result && result.isMultisig) {
        toast({
          title: "Multisig proposal created",
          description:
            "Certificate will be downloaded after the proposal is executed.",
        });
      } else {
        toast({
          title: "Certificate enrolled successfully",
          description:
            "Your certificate files have been downloaded and registered on-chain.",
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
