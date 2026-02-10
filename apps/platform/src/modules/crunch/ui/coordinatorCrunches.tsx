"use client";

import { useMemo } from "react";
import { Button, Skeleton } from "@crunch-ui/core";
import { useGetCoordinatorCrunches } from "../application/hooks/useGetCoordinatorCrunches";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import {
  getCoordinatorProgram,
  CrunchAccountServiceWithContext,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { CrunchCard } from "./crunchCard";

export function CoordinatorCrunches() {
  const { crunches, crunchesLoading, crunchesPending } =
    useGetCoordinatorCrunches();
  const { anchorProvider } = useAnchorProvider();

  const crunchAccountService = useMemo(() => {
    if (!anchorProvider) return null;
    const coordinatorProgram = getCoordinatorProgram(anchorProvider);
    return CrunchAccountServiceWithContext({ program: coordinatorProgram });
  }, [anchorProvider]);

  if (crunchesLoading || crunchesPending) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!crunches || crunches.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          You didn&apos;t create any crunches yet, create your first one!
        </p>
        <Link href={INTERNAL_LINKS.CREATE_CRUNCH}>
          <Button>Create your First Crunch</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {crunches.map((crunch) => (
        <CrunchCard
          key={crunch.name}
          name={crunch.name}
          state={crunch.state ?? "unknown"}
          address={crunchAccountService
            ?.getCrunchAddress(crunch.name)
            .toBase58()}
        />
      ))}
    </div>
  );
}
