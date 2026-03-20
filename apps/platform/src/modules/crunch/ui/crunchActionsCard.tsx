"use client";

import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { EnvironmentSwitcher } from "@/modules/environment/ui/environmentSwitcher";
import { WalletConnection } from "@/modules/wallet/ui/walletConnection";
import { useCrunchContext } from "../application/context/crunchContext";
import { useEndCrunch } from "../application/hooks/useEndCrunch";
import { FundCrunchDialog } from "./fundCrunchDialog";
import { StartCrunchDialog } from "./startCrunchDialog";

const STATE_VARIANT: Record<string, "success" | "secondary" | "destructive"> = {
  started: "success",
  created: "secondary",
  ended: "destructive",
  marginpaidout: "destructive",
  drained: "destructive",
};

export function CrunchActionsCard() {
  const { crunchName, crunchData, crunchState, isLoading } = useCrunchContext();
  const { endCrunch, endCrunchLoading } = useEndCrunch();

  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);

  if (isLoading || !crunchData) return null;

  const isCreated = crunchState === "created";
  const isStarted = crunchState === "started";
  const canStart = isCreated;
  const canEnd = isStarted;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Protocol Actions
                <Badge variant={STATE_VARIANT[crunchState] ?? "secondary"}>
                  {crunchState}
                </Badge>
              </CardTitle>
              <CardDescription>
                Manage your crunch lifecycle on-chain — fund the reward vault,
                start accepting submissions, or end the crunch.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <EnvironmentSwitcher />
              <WalletConnection />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <ActionItem
              title="Fund Crunch"
              description="Deposit USDC into the reward vault."
              button={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFundDialogOpen(true)}
                >
                  Fund
                </Button>
              }
            />
            <ActionItem
              title="Start Crunch"
              description="Open the crunch for submissions. Crunchers can start submitting models once started."
              button={
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canStart}
                  onClick={() => setStartDialogOpen(true)}
                >
                  Start
                </Button>
              }
            />
            <ActionItem
              title="End Crunch"
              description="No more submissions will be accepted."
              button={
                <AlertDialog
                  open={endDialogOpen}
                  onOpenChange={setEndDialogOpen}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={!canEnd}
                    onClick={() => setEndDialogOpen(true)}
                  >
                    End
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>End "{crunchName}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will stop accepting submissions and pay out the
                        margin. This action requires an on-chain transaction and
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          endCrunch(
                            { crunchName },
                            { onSuccess: () => setEndDialogOpen(false) }
                          )
                        }
                        disabled={endCrunchLoading}
                      >
                        {endCrunchLoading ? "Ending..." : "Confirm End"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
            />
          </div>
        </CardContent>
      </Card>

      <FundCrunchDialog
        open={fundDialogOpen}
        onOpenChange={setFundDialogOpen}
        crunchName={crunchName}
        crunchAddress={new PublicKey(crunchData.address)}
      />
      <StartCrunchDialog
        open={startDialogOpen}
        onOpenChange={setStartDialogOpen}
        crunchName={crunchName}
        currentState={crunchState}
      />
    </>
  );
}

function ActionItem({
  title,
  description,
  button,
}: {
  title: string;
  description: string;
  button: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground flex-1">{description}</p>
      <div className="mt-2">{button}</div>
    </div>
  );
}
