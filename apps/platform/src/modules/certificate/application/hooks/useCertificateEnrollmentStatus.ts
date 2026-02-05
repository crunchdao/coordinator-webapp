"use client";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export interface CertificateEnrollmentInfo {
  enrolled: true;
  signature: string;
  blockTime: number | null;
  certPub: string;
  hotkey: string;
  /** Current on-chain hotkey — if different from memo hotkey, enrollment is stale */
  currentHotkey: string | null;
  /** True if the memo hotkey matches the current on-chain hotkey */
  hotkeyMatch: boolean;
}

interface NotEnrolled {
  enrolled: false;
}

type EnrollmentStatus = CertificateEnrollmentInfo | NotEnrolled | null;

/**
 * Parses a memo string to extract cert_pub and hotkey.
 * The memo is a JSON string: {"cert_pub": "...", "hotkey": "..."}
 */
function parseCertMemo(
  memoData: string
): { certPub: string; hotkey: string } | null {
  try {
    const parsed = JSON.parse(memoData);
    if (parsed.cert_pub && parsed.hotkey) {
      return { certPub: parsed.cert_pub, hotkey: parsed.hotkey };
    }
  } catch {
    // Not valid JSON or missing fields
  }
  return null;
}

/**
 * Extracts cert enrollment data from a memo log line.
 * Log format: "Program log: Memo (len NNN): \"<json>\""
 */
function extractFromLogMessage(
  log: string
): { certPub: string; hotkey: string } | null {
  if (!log.includes("cert_pub")) return null;

  // Extract the JSON from the log line
  const memoMatch = log.match(/Memo \(len \d+\): "(.*)"$/);
  if (memoMatch) {
    // Unescape the JSON string (it's double-escaped in the log)
    try {
      const unescaped = JSON.parse(`"${memoMatch[1]}"`);
      return parseCertMemo(unescaped);
    } catch {
      return parseCertMemo(memoMatch[1]);
    }
  }
  return null;
}

/**
 * Fetches the current on-chain hotkey for the given wallet from the CPI API.
 */
async function fetchCurrentHotkey(
  walletAddress: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/certificate/hotkey?wallet=${encodeURIComponent(walletAddress)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.hotkey || null;
  } catch {
    return null;
  }
}

/**
 * Checks whether a certificate enrollment memo transaction exists on-chain
 * for the effective authority (vault in multisig mode, wallet otherwise).
 *
 * Searches recent transactions for a Memo instruction containing
 * {"cert_pub": "...", "hotkey": "..."} and extracts both values.
 * Also compares the memo hotkey against the current on-chain hotkey
 * to detect stale enrollments after hotkey rotation.
 */
export const useCertificateEnrollmentStatus = () => {
  const { connection } = useConnection();
  const { authority, ready } = useEffectiveAuthority();

  const query = useQuery<EnrollmentStatus>({
    queryKey: ["certificate-enrollment-status", authority?.toString()],
    queryFn: async (): Promise<EnrollmentStatus> => {
      if (!authority) return null;

      try {
        // Get recent transaction signatures for this authority
        const signatures = await connection.getSignaturesForAddress(authority, {
          limit: 50,
        });

        let memoResult: {
          certPub: string;
          hotkey: string;
          signature: string;
          blockTime: number | null;
        } | null = null;

        for (const sigInfo of signatures) {
          if (sigInfo.err) continue;

          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx?.meta?.logMessages) continue;

          // Try extracting from log messages first
          for (const log of tx.meta.logMessages) {
            const result = extractFromLogMessage(log);
            if (result) {
              memoResult = {
                ...result,
                signature: sigInfo.signature,
                blockTime: sigInfo.blockTime ?? null,
              };
              break;
            }
          }
          if (memoResult) break;

          // Also check inner instructions for parsed memo data (Squads CPI)
          for (const inner of tx.meta.innerInstructions || []) {
            for (const ix of inner.instructions) {
              if (
                "parsed" in ix &&
                ix.programId?.equals(MEMO_PROGRAM_ID) &&
                typeof ix.parsed === "string"
              ) {
                const result = parseCertMemo(ix.parsed);
                if (result) {
                  memoResult = {
                    ...result,
                    signature: sigInfo.signature,
                    blockTime: sigInfo.blockTime ?? null,
                  };
                  break;
                }
              }
            }
            if (memoResult) break;
          }
          if (memoResult) break;
        }

        if (!memoResult) {
          return { enrolled: false };
        }

        // Compare memo hotkey with current on-chain hotkey
        const currentHotkey = await fetchCurrentHotkey(authority.toBase58());

        return {
          enrolled: true,
          signature: memoResult.signature,
          blockTime: memoResult.blockTime,
          certPub: memoResult.certPub,
          hotkey: memoResult.hotkey,
          currentHotkey,
          hotkeyMatch:
            currentHotkey !== null && currentHotkey === memoResult.hotkey,
        };
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
