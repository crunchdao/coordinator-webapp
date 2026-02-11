"use client";

import { Button, Skeleton } from "@crunch-ui/core";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useGetCoordinatorCpi } from "../application/hooks/useGetCoordinatorCpi";
import { useGetCrunches } from "../application/hooks/useGetCrunches";
import { CrunchCard } from "./crunchCard";

export function CoordinatorCrunches() {
  const { authority, ready } = useEffectiveAuthority();

  const { coordinator, coordinatorLoading } = useGetCoordinatorCpi(
    authority?.toString()
  );

  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator ? { coordinator: coordinator.address } : undefined
  );

  if (!ready || coordinatorLoading || crunchesLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (crunches.length === 0) {
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
          state={crunch.state?.toLowerCase() ?? "unknown"}
          address={crunch.address}
        />
      ))}
    </div>
  );
}
