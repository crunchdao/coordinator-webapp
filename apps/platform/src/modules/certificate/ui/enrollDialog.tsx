"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@crunch-ui/core";
import { useEnrollCertificate } from "../application/hooks/useEnrollCertificate";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface EnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollDialog({ open, onOpenChange }: EnrollDialogProps) {
  const { connected } = useWallet();
  const { enroll, isEnrolling, isSuccess, reset } = useEnrollCertificate();

  const handleEnroll = () => {
    enroll(undefined, {
      onSuccess: () => {
        setTimeout(() => {
          onOpenChange(false);
          reset();
        }, 2000);
      },
    });
  };

  const handleClose = () => {
    if (!isEnrolling) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {isEnrolling && (
          <LoadingOverlay
            title="Enrolling Certificate"
            subtitle="Please sign the message with your wallet..."
          />
        )}
        <DialogHeader>
          <DialogTitle>Enroll Certificate</DialogTitle>
          <DialogDescription>
            Generate and sign a TLS certificate for your coordinator node.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isSuccess ? (
            <>
              <p className="text-sm text-muted-foreground">This will:</p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                <li>Generate a new TLS certificate</li>
                <li>
                  Fetch your hotkey from your Coordinator account on Solana
                </li>
                <li>Request your wallet signature</li>
                <li>Download a ZIP file with your certificate files</li>
              </ol>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isEnrolling}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={!connected || isEnrolling}
                  loading={isEnrolling}
                >
                  {connected ? "Enroll" : "Connect Wallet First"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-green-600 font-medium">
                Certificate enrolled successfully!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your certificate files have been downloaded.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
