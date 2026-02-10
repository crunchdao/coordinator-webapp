"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { useCrunchContext } from "../application/context/crunchContext";
import { FundCrunchDialog } from "./fundCrunchDialog";
import { StartCrunchDialog } from "./startCrunchDialog";
import { RewardVaultBalance } from "./rewardVaultBalance";

export function CrunchOverview() {
  const { crunchName, crunchAddress, crunchData, isLoading } =
    useCrunchContext();

  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);

  if (isLoading || !crunchData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const state = crunchData.state
    ? Object.keys(crunchData.state)[0]
    : "unknown";

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{crunchName}</h1>
          <Badge
            variant={state === "started" ? "success" : "secondary"}
            size="sm"
          >
            {state}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crunch Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-muted-foreground">Crunch Address</span>
              <SolanaAddressLink address={crunchAddress!.toString()} />

              <span className="text-muted-foreground">Reward Vault</span>
              <SolanaAddressLink
                address={crunchData.rewardVault.toString()}
              />

              <span className="text-muted-foreground">Vault Balance</span>
              <RewardVaultBalance
                rewardVaultAddress={crunchData.rewardVault}
              />

              <span className="text-muted-foreground">Payout Amount</span>
              <span>
                {(
                  crunchData.payoutAmount.toNumber() /
                  10 ** 6
                ).toLocaleString()}{" "}
                USDC
              </span>

              <span className="text-muted-foreground">
                Max Models per Cruncher
              </span>
              <span>{crunchData.maxModelsPerCruncher}</span>

              <span className="text-muted-foreground">
                Last Checkpoint Index
              </span>
              <span>{crunchData.lastCheckpointIndex}</span>

              <span className="text-muted-foreground">Crunchers</span>
              <span>{crunchData.crunchers.length}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFundDialogOpen(true)}
          >
            Fund Crunch
          </Button>
          {state !== "started" && (
            <Button
              variant="outline"
              onClick={() => setStartDialogOpen(true)}
            >
              Start Crunch
            </Button>
          )}
        </div>
      </div>

      {crunchAddress && (
        <>
          <FundCrunchDialog
            open={fundDialogOpen}
            onOpenChange={setFundDialogOpen}
            crunchName={crunchName}
            crunchAddress={crunchAddress}
          />
          <StartCrunchDialog
            open={startDialogOpen}
            onOpenChange={setStartDialogOpen}
            crunchName={crunchName}
            currentState={state}
          />
        </>
      )}
    </>
  );
}
