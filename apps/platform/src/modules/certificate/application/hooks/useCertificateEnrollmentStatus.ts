"use client";
import { useQuery } from "@tanstack/react-query";
import { getCoordinatorProgram, getCoordinatorCertificate } from "@crunchdao/sdk";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";

export interface CertificateEnrollmentInfo {
  enrolled: true;
  /** SHA-256 hash of the primary certificate (hex string) */
  primaryCertHash: string;
  /** SHA-256 hash of the secondary certificate (hex string), or null if empty */
  secondaryCertHash: string | null;
  /** Unix timestamp when primary cert was last updated */
  primaryUpdatedAt: number;
  /** Unix timestamp when secondary cert was last updated */
  secondaryUpdatedAt: number;
}

interface NotEnrolled {
  enrolled: false;
}

type EnrollmentStatus = CertificateEnrollmentInfo | NotEnrolled | null;

/**
 * Convert a number array (bytes) to hex string
 */
function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Check if a certificate hash is empty (all zeros)
 */
function isEmptyHash(hash: number[]): boolean {
  return hash.every((byte) => byte === 0);
}

/**
 * Checks whether a certificate is registered on-chain for the effective authority
 * (vault in multisig mode, wallet otherwise).
 *
 * Reads the CoordinatorCertificate account derived from the authority's public key
 * and returns the certificate hash information.
 */
export const useCertificateEnrollmentStatus = () => {
  const { authority, ready } = useEffectiveAuthority();
  const { anchorProvider } = useAnchorProvider();

  const query = useQuery<EnrollmentStatus>({
    queryKey: ["certificate-enrollment-status", authority?.toString()],
    queryFn: async (): Promise<EnrollmentStatus> => {
      if (!authority || !anchorProvider) return null;

      try {
        const coordinatorProgram = getCoordinatorProgram(anchorProvider);
        const cert = await getCoordinatorCertificate(
          coordinatorProgram,
          authority
        );

        // No certificate account exists
        if (!cert) {
          return { enrolled: false };
        }

        // Check if the primary hash is empty (shouldn't happen but handle it)
        if (isEmptyHash(cert.certHash)) {
          return { enrolled: false };
        }

        return {
          enrolled: true,
          primaryCertHash: bytesToHex(cert.certHash),
          secondaryCertHash: isEmptyHash(cert.certHashSecondary)
            ? null
            : bytesToHex(cert.certHashSecondary),
          primaryUpdatedAt: cert.primaryUpdatedAt.toNumber(),
          secondaryUpdatedAt: cert.secondaryUpdatedAt.toNumber(),
        };
      } catch (error) {
        console.error("Error checking certificate enrollment:", error);
        return { enrolled: false };
      }
    },
    enabled: !!authority && !!anchorProvider && ready,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });

  return {
    enrollmentStatus: query.data,
    enrollmentStatusLoading: query.isLoading,
    refetchEnrollmentStatus: query.refetch,
  };
};
