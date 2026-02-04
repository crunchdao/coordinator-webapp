"use client";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

/**
 * Checks whether a certificate enrollment memo transaction exists on-chain
 * for the effective authority (vault in multisig mode, wallet otherwise).
 *
 * Searches recent transactions involving the Memo program for a memo
 * containing "cert_pub", which proves certificate enrollment was executed.
 */
export const useCertificateEnrollmentStatus = () => {
  const { connection } = useConnection();
  const { authority, ready } = useEffectiveAuthority();

  const query = useQuery({
    queryKey: ["certificate-enrollment-status", authority?.toString()],
    queryFn: async () => {
      if (!authority) return null;

      try {
        // Get recent transaction signatures for this authority
        const signatures = await connection.getSignaturesForAddress(
          authority,
          { limit: 50 }
        );

        // Check each transaction for a memo containing cert_pub
        for (const sigInfo of signatures) {
          if (sigInfo.err) continue;

          const tx = await connection.getParsedTransaction(
            sigInfo.signature,
            {
              maxSupportedTransactionVersion: 0,
            }
          );

          if (!tx?.meta?.logMessages) continue;

          // Look for memo program logs containing cert_pub
          const hasCertMemo = tx.meta.logMessages.some(
            (log) =>
              log.includes("Program log: Memo") &&
              log.includes("cert_pub")
          );

          if (hasCertMemo) {
            return {
              enrolled: true,
              signature: sigInfo.signature,
              blockTime: sigInfo.blockTime,
            };
          }

          // Also check inner instructions for memo data (Squads CPI)
          const innerInstructions = tx.meta.innerInstructions || [];
          for (const inner of innerInstructions) {
            for (const ix of inner.instructions) {
              if (
                "parsed" in ix &&
                ix.programId?.equals(MEMO_PROGRAM_ID)
              ) {
                const data =
                  typeof ix.parsed === "string" ? ix.parsed : "";
                if (data.includes("cert_pub")) {
                  return {
                    enrolled: true,
                    signature: sigInfo.signature,
                    blockTime: sigInfo.blockTime,
                  };
                }
              }
            }
          }
        }

        return { enrolled: false };
      } catch (error) {
        console.error("Error checking certificate enrollment:", error);
        return { enrolled: false };
      }
    },
    enabled: !!authority && ready,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  return {
    enrollmentStatus: query.data,
    enrollmentStatusLoading: query.isLoading,
    refetchEnrollmentStatus: query.refetch,
  };
};
