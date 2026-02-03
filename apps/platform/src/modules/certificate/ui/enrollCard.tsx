"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { EnrollDialog } from "./enrollDialog";

export function EnrollCard() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { connected } = useWallet();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Certificate Enrollment</CardTitle>
          <CardDescription>
            Generate and sign a TLS certificate for your coordinator node
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your coordinator node requires a signed TLS certificate to securely
              communicate with the Crunch Protocol Model Nodes. 
              <br />
              <br />
              Once done a download of a ZIP file with your certificate files will be initiated. 
              Add that to your coordinator node and configure it to use the certificate. 
            
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
              {connected ? "Enroll Certificate" : "Connect Wallet to Enroll"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <EnrollDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
