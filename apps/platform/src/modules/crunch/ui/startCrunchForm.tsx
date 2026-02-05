"use client";

import { Badge, Button } from "@crunch-ui/core";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { PublicKey } from "@solana/web3.js";
import { useStartCrunch } from "../application/hooks/useStartCrunch";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface StartCrunchFormProps {
  crunchName: string;
  crunchAddress?: PublicKey;
  currentState: string;
  onSuccess?: () => void;
  showCrunchInfo?: boolean;
}

export function StartCrunchForm({
  crunchName,
  crunchAddress,
  currentState,
  onSuccess,
  showCrunchInfo = false,
}: StartCrunchFormProps) {
  const { startCrunch, startCrunchLoading } = useStartCrunch();

  const handleStart = () => {
    startCrunch(
      { crunchName },
      { onSuccess }
    );
  };

  return (
    <>
      {startCrunchLoading && (
        <LoadingOverlay
          title="Starting Crunch"
          subtitle="Processing your transaction..."
        />
      )}
      <div className="space-y-4">
        {showCrunchInfo && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex justify-between">
              <span>Crunch</span>
              <span className="font-medium text-foreground">{crunchName}</span>
            </p>
            {crunchAddress && (
              <p className="flex justify-between">
                <span>Address</span>
                <SolanaAddressLink address={crunchAddress.toString()} />
              </p>
            )}
            <p className="flex justify-between">
              <span>Current Status</span>
              <Badge variant="secondary">{currentState}</Badge>
            </p>
          </div>
        )}

        {!showCrunchInfo && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-foreground">Current Status:</span>
            <Badge variant="secondary">{currentState}</Badge>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          Once started, crunchers will be able to register and participate.
        </p>

        <Button
          className="ml-auto block"
          onClick={handleStart}
          disabled={startCrunchLoading}
          loading={startCrunchLoading}
        >
          Start Crunch
        </Button>
      </div>
    </>
  );
}
