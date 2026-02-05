"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Skeleton,
  toast,
} from "@crunch-ui/core";
import { Check, Copy, InfoCircle } from "@crunch-ui/icons";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { EnrollDialog } from "./enrollDialog";
import { useCertificateEnrollmentStatus } from "../application/hooks/useCertificateEnrollmentStatus";

const solanaCluster =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
    ? ("mainnet-beta" as const)
    : ("devnet" as const);

function truncateMiddle(str: string, maxLen: number = 40): string {
  if (str.length <= maxLen) return str;
  const half = Math.floor(maxLen / 2);
  return str.slice(0, half) + "…" + str.slice(-half);
}

function CopyableValue({
  value,
  maxLen = 16,
}: {
  value: string;
  maxLen?: number;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast({ title: "Copied to clipboard" });
  };

  const isTruncated = value.length > maxLen;

  return (
    <span className="flex items-center gap-1">
      {truncateMiddle(value, maxLen)}
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={handleCopy}
        title={isTruncated ? `${value} (click to copy)` : "Click to copy"}
      >
        <Copy />
      </Button>
    </span>
  );
}

interface EnrollFormProps {
  showStatus?: boolean;
}

export function EnrollForm({ showStatus = false }: EnrollFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connected } = useWallet();
  const { enrollmentStatus, enrollmentStatusLoading } =
    useCertificateEnrollmentStatus();

  const isEnrolled = enrollmentStatus?.enrolled === true;
  const isStale = isEnrolled && !enrollmentStatus.hotkeyMatch;

  if (enrollmentStatusLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <>
      <div className="space-y-4">
        {showStatus && connected && (
          <p className="body-xs text-muted-foreground flex justify-between">
            <span>Status</span>
            <Badge
              variant={
                isEnrolled ? (isStale ? "destructive" : "success") : "secondary"
              }
            >
              {isEnrolled ? (isStale ? "Stale" : "Enrolled") : "Not Enrolled"}
            </Badge>
          </p>
        )}

        {isEnrolled ? (
          <div className="space-y-4">
            {isStale ? (
              <Alert variant="warning">
                <InfoCircle className="w-4 h-4" />
                <AlertDescription>
                  Hotkey rotated — re-enrollment required
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="success">
                <Check className="w-4 h-4" />
                <AlertDescription>
                  <AlertTitle>Certificate enrolled</AlertTitle>
                  {enrollmentStatus.blockTime && (
                    <span className="body-xs text-muted-foreground">
                      (
                      {new Date(
                        enrollmentStatus.blockTime * 1000
                      ).toLocaleDateString()}
                      )
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="body-xs text-muted-foreground space-y-1">
              <p className="flex justify-between gap-2">
                <span>Hotkey</span>
                <CopyableValue value={enrollmentStatus.hotkey} />
              </p>
              {isStale && enrollmentStatus.currentHotkey && (
                <p className="flex justify-between gap-2">
                  <span>Current hotkey</span>
                  <CopyableValue value={enrollmentStatus.currentHotkey} />
                </p>
              )}
              <p className="flex justify-between gap-2">
                <span>Cert public key</span>
                <CopyableValue value={enrollmentStatus.certPub} />
              </p>
              <p className="flex justify-between gap-2">
                <span>Transaction</span>
                <SolanaAddressLink
                  address={enrollmentStatus.signature}
                  type="tx"
                  cluster={solanaCluster}
                />
              </p>
            </div>

            <Button
              className="ml-auto block"
              variant={isStale ? "destructive" : "outline"}
              onClick={() => setDialogOpen(true)}
              disabled={!connected}
            >
              Re-enroll Certificate
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="body-sm text-muted-foreground">
              Your coordinator node requires a signed TLS certificate to
              securely communicate with the Crunch Protocol Model Nodes.
            </p>

            {!connected && (
              <Alert variant="warning">
                <InfoCircle className="w-4 h-4" />
                <AlertDescription>
                  Connect your wallet to proceed
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="ml-auto block"
              onClick={() => setDialogOpen(true)}
              disabled={!connected}
            >
              Enroll Certificate
            </Button>
          </div>
        )}
      </div>

      <EnrollDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
