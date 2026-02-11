"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { generateLink } from "@crunch-ui/utils";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useCrunchContext } from "../application/context/crunchContext";
import { FundCrunchDialog } from "./fundCrunchDialog";
import { StartCrunchDialog } from "./startCrunchDialog";
import { RewardVaultBalance } from "./rewardVaultBalance";

export function CrunchOverview() {
  const { crunchName, crunchAddress, crunchData, crunchState, isLoading } =
    useCrunchContext();

  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);

  if (isLoading || !crunchData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Crunch Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-muted-foreground">Crunch Address</span>
            <SolanaAddressLink address={crunchAddress!.toString()} />

            <span className="text-muted-foreground">Reward Vault</span>
            <SolanaAddressLink address={crunchData.rewardVault.toString()} />

            <span className="text-muted-foreground">Vault Balance</span>
            <RewardVaultBalance rewardVaultAddress={crunchData.rewardVault} />

            <span className="text-muted-foreground">Payout Amount</span>
            <span>
              {(crunchData.payoutAmount.toNumber() / 10 ** 6).toLocaleString()}{" "}
              USDC
            </span>

            <span className="text-muted-foreground">
              Max Models per Cruncher
            </span>
            <span>{crunchData.maxModelsPerCruncher}</span>

            <span className="text-muted-foreground">Last Checkpoint Index</span>
            <span>{crunchData.lastCheckpointIndex}</span>

            <span className="text-muted-foreground">Crunchers</span>
            <span>{crunchData.crunchers.length}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setFundDialogOpen(true)}>
              Fund Crunch
            </Button>
            {crunchState !== "started" && (
              <Button
                variant="outline"
                onClick={() => setStartDialogOpen(true)}
              >
                Start Crunch
              </Button>
            )}
            <Link
              href={generateLink(INTERNAL_LINKS.CHECKPOINT_CREATE, {
                crunchname: crunchName,
              })}
            >
              <Button>Create Checkpoint</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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
            currentState={crunchState}
          />
        </>
      )}
    </>
  );
}
