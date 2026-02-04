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
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { EnrollDialog } from "./enrollDialog";
import { useCertificateEnrollmentStatus } from "../application/hooks/useCertificateEnrollmentStatus";

export function EnrollCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connected } = useWallet();
  const { enrollmentStatus, enrollmentStatusLoading } =
    useCertificateEnrollmentStatus();

  const isEnrolled = enrollmentStatus?.enrolled === true;

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
              <Badge variant={isEnrolled ? "success" : "secondary"}>
                {isEnrolled ? "Enrolled" : "Not Enrolled"}
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
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                  <span className="text-lg font-bold text-green-500">✓</span>
                  <div>
                    <p className="text-sm font-medium text-green-600">
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
                {enrollmentStatus.signature && (
                  <p className="text-xs text-muted-foreground">
                    Transaction:{" "}
                    <SolanaAddressLink
                      address={enrollmentStatus.signature}
                      type="tx"
                    />
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  You can re-enroll to generate a new certificate if needed.
                </p>
                <Button
                  variant="outline"
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
