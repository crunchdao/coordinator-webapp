"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { Check } from "@crunch-ui/icons";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { EnrollDialog } from "./enrollDialog";
import { useCertificateEnrollmentStatus } from "../application/hooks/useCertificateEnrollmentStatus";

const solanaCluster =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
    ? ("mainnet-beta" as const)
    : ("devnet" as const);

function truncate(str: string, maxLen: number = 20): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

export function EnrollCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connected } = useWallet();
  const { enrollmentStatus, enrollmentStatusLoading } =
    useCertificateEnrollmentStatus();

  const isEnrolled = enrollmentStatus?.enrolled === true;
  const isStale = isEnrolled && !enrollmentStatus.hotkeyMatch;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certificate Enrollment</CardTitle>
              <CardDescription>
                Generate and sign a TLS certificate for your coordinator node
              </CardDescription>
            </div>
            {connected && !enrollmentStatusLoading && (
              <Badge
                variant={
                  isEnrolled ? (isStale ? "destructive" : "success") : "secondary"
                }
              >
                {isEnrolled
                  ? isStale
                    ? "Stale — Re-enroll Required"
                    : "Enrolled"
                  : "Not Enrolled"}
              </Badge>
            )}
            {connected && enrollmentStatusLoading && (
              <Skeleton className="h-6 w-20" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEnrolled ? (
              <div className="space-y-3">
                {isStale ? (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2">
                    <span className="text-lg font-bold text-amber-500">⚠</span>
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        Hotkey has been rotated — re-enrollment required
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The on-chain hotkey no longer matches the one in the
                        certificate enrollment memo. Generate a new certificate
                        to bind it to the current hotkey.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        Certificate enrollment confirmed on-chain
                      </p>
                      {enrollmentStatus.blockTime && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            enrollmentStatus.blockTime * 1000
                          ).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium shrink-0">Hotkey:</span>
                    <code className="break-all font-mono">
                      {enrollmentStatus.hotkey}
                    </code>
                    {isStale && enrollmentStatus.currentHotkey && (
                      <span className="text-amber-500 shrink-0">(old)</span>
                    )}
                  </div>
                  {isStale && enrollmentStatus.currentHotkey && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-medium shrink-0">Current hotkey:</span>
                      <code className="break-all font-mono">
                        {enrollmentStatus.currentHotkey}
                      </code>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium shrink-0">Cert public key:</span>
                    <code className="break-all font-mono">
                      {truncate(enrollmentStatus.certPub, 40)}
                    </code>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-medium shrink-0">Transaction:</span>
                    <SolanaAddressLink
                      address={enrollmentStatus.signature}
                      type="tx"
                      cluster={solanaCluster}
                    />
                  </div>
                </div>

                <Button
                  variant={isStale ? "destructive" : "outline"}
                  onClick={() => setDialogOpen(true)}
                  disabled={!connected}
                >
                  Re-enroll Certificate
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Your coordinator node requires a signed TLS certificate to
                  securely communicate with the Crunch Protocol Model Nodes.
                  <br />
                  <br />
                  Once done a download of a ZIP file with your certificate files
                  will be initiated. Add that to your coordinator node and
                  configure it to use the certificate.
                </p>

                {!connected && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Please connect your wallet to proceed with enrollment.
                  </p>
                )}

                <Button
                  onClick={() => setDialogOpen(true)}
                  disabled={!connected}
                  className="w-full sm:w-auto"
                >
                  {connected
                    ? "Enroll Certificate"
                    : "Connect Wallet to Enroll"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <EnrollDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
