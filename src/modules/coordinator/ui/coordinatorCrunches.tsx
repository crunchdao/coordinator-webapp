"use client";
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
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import Link from "next/link";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { LOCAL_CRUNCH_NAME } from "@/utils/config";
import { CircleCheck, Cube, Payout, Plus, Wallet } from "@crunch-ui/icons";
import { SolanaAddressLink } from "@crunchdao/solana-utils";

export function CoordinatorCrunches() {
  const { crunches, crunchesLoading, crunchesPending } =
    useGetCoordinatorCrunches();
  const { isLocal } = useSettings();

  if (isLocal) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          Local mode: Access your local crunch environment.
        </p>
        <Link
          href={generateLink(INTERNAL_LINKS.LEADERBOARD, {
            crunchname: LOCAL_CRUNCH_NAME,
          })}
        >
          <Button>Enter {LOCAL_CRUNCH_NAME}</Button>
        </Link>
      </div>
    );
  }

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
          <Card key={crunch.name}>
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
                <p className="text-sm line-clamp-2">
                  <span className="font-medium text-foreground">
                    <Wallet /> Reward Vault:
                  </span>{" "}
                  <SolanaAddressLink address={crunch.rewardVault.toString()} />
                </p>
              </div>

              <Link
                key={crunch.name}
                href={generateLink(INTERNAL_LINKS.LEADERBOARD, {
                  crunchname: crunch.name,
                })}
                className="w-full"
              >
                <Button className="w-full" variant="outline" size="sm">
                  Enter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end mt-8">
        <Link
          href={INTERNAL_LINKS.CREATE_CRUNCH}
          onClick={(e) => {
            if (crunches?.length > 0) {
              e.preventDefault();
            }
          }}
        >
          <Button disabled={crunches?.length > 0}>
            Create Crunch <Plus />
          </Button>
        </Link>
      </div>
    </>
  );
}
