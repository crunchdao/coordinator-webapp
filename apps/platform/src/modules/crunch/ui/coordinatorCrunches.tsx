"use client";
import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { useGetCoordinatorCrunches } from "../application/hooks/useGetCoordinatorCrunches";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import { CircleCheck, Cube, Payout, Plus, Wallet } from "@crunch-ui/icons";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { FundCrunchDialog } from "./fundCrunchDialog";
import { StartCrunchDialog } from "./startCrunchDialog";
import { RewardVaultBalance } from "./rewardVaultBalance";
import {
  getCoordinatorProgram,
  CrunchAccountServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { PublicKey } from "@solana/web3.js";

interface SelectedCrunch {
  name: string;
  address: PublicKey;
  state: string;
}

export function CoordinatorCrunches() {
  const { crunches, crunchesLoading, crunchesPending } =
    useGetCoordinatorCrunches();
  const { anchorProvider } = useAnchorProvider();

  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [selectedCrunch, setSelectedCrunch] = useState<SelectedCrunch | null>(
    null
  );

  const crunchAccountService = useMemo(() => {
    if (!anchorProvider) return null;
    const coordinatorProgram = getCoordinatorProgram(anchorProvider);
    return CrunchAccountServiceWithContext({ program: coordinatorProgram });
  }, [anchorProvider]);

  const handleFundClick = (crunchName: string, crunchState: string) => {
    if (!crunchAccountService) return;
    const crunchAddress = crunchAccountService.getCrunchAddress(crunchName);
    setSelectedCrunch({
      name: crunchName,
      address: crunchAddress,
      state: crunchState,
    });
    setFundDialogOpen(true);
  };

  const handleStartClick = (crunchName: string, crunchState: string) => {
    if (!crunchAccountService) return;
    const crunchAddress = crunchAccountService.getCrunchAddress(crunchName);
    setSelectedCrunch({
      name: crunchName,
      address: crunchAddress,
      state: crunchState,
    });
    setStartDialogOpen(true);
  };

  if (crunchesLoading || crunchesPending) {
    return (
      <div className="grid gap-4">
        <div>
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!crunches || crunches.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          You didn't create any crunches yet, create your first one!
        </p>
        <Link href={INTERNAL_LINKS.CREATE_CRUNCH}>
          <Button>Create your First Crunch</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {crunches.map((crunch) => (
          <Card className="bg-background" key={crunch.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crunch.name}</CardTitle>
                <Badge
                  variant={crunch.state === "started" ? "success" : "secondary"}
                  size="sm"
                >
                  {crunch.state}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 [&_svg]:mb-0.5 [&_svg]:w-6 [&_svg]:inline text-muted-foreground">
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <Cube />
                    Max models per cruncher:
                  </span>{" "}
                  {crunch.maxModelsPerCruncher}
                </p>
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <CircleCheck />
                    Last checkpoint index:
                  </span>{" "}
                  {crunch.lastCheckpointIndex}
                </p>
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <Payout /> Payout amount:
                  </span>{" "}
                  {(crunch.payoutAmount.toNumber() / 10 ** 6).toLocaleString()}{" "}
                  USDC
                </p>
                {crunchAccountService && (
                  <p className="text-sm line-clamp-2">
                    <span className="font-medium text-foreground">
                      <Wallet /> Crunch Address:
                    </span>{" "}
                    <SolanaAddressLink
                      address={crunchAccountService
                        .getCrunchAddress(crunch.name)
                        .toString()}
                    />
                  </p>
                )}
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <Wallet /> Reward Vault:
                  </span>{" "}
                  <SolanaAddressLink address={crunch.rewardVault.toString()} />
                </p>
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <Payout /> Vault Balance:
                  </span>{" "}
                  <RewardVaultBalance rewardVaultAddress={crunch.rewardVault} />
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFundClick(crunch.name, crunch.state ?? "unknown")
                  }
                  disabled={!crunchAccountService}
                >
                  Fund
                </Button>
                {crunch.state !== "started" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleStartClick(crunch.name, crunch.state ?? "unknown")
                    }
                    disabled={!crunchAccountService}
                  >
                    Start
                  </Button>
                )}
                {/*<Link
                  href={generateLink(INTERNAL_LINKS.LEADERBOARD, {
                    crunchname: crunch.name,
                  })}
                  className="flex-1"
                >
                  <Button className="w-full" variant="outline" size="sm">
                    Enter
                  </Button>
                </Link>*/}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCrunch && (
        <>
          {selectedCrunch.address}
          <FundCrunchDialog
            open={fundDialogOpen}
            onOpenChange={setFundDialogOpen}
            crunchName={selectedCrunch.name}
            crunchAddress={selectedCrunch.address}
          />
          <StartCrunchDialog
            open={startDialogOpen}
            onOpenChange={setStartDialogOpen}
            crunchName={selectedCrunch.name}
            currentState={selectedCrunch.state}
          />
        </>
      )}
    </>
  );
}
