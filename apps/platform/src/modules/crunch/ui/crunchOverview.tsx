"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
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
  const { crunchName, crunchData, crunchState, isLoading } = useCrunchContext();

  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);

  if (isLoading || !crunchData) {
    return <Skeleton className="h-96 w-full" />;
  }

  const rewardVaultPubkey = new PublicKey(crunchData.rewardVault);
  const crunchAddressPubkey = new PublicKey(crunchData.address);
  const payoutAmount = Number(crunchData.payoutAmount) / 10 ** 6;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Crunch Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-muted-foreground">Crunch Address</span>
            <SolanaAddressLink address={crunchData.address} />

            <span className="text-muted-foreground">Reward Vault</span>
            <SolanaAddressLink address={crunchData.rewardVault} />

            <span className="text-muted-foreground">Vault Balance</span>
            <RewardVaultBalance rewardVaultAddress={rewardVaultPubkey} />

            <span className="text-muted-foreground">Payout Amount</span>
            <span>{payoutAmount.toLocaleString()} USDC</span>

            <span className="text-muted-foreground">
              Max Models per Cruncher
            </span>
            <span>{crunchData.maxModelsPerCruncher}</span>

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

      <FundCrunchDialog
        open={fundDialogOpen}
        onOpenChange={setFundDialogOpen}
        crunchName={crunchName}
        crunchAddress={crunchAddressPubkey}
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
