"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import Link from "next/link";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";
import { useLocalAddressMap } from "@/modules/config/application/hooks/useLocalAddressMap";
import { useGetCrunches } from "../application/hooks/useGetCrunches";
import { CrunchCard } from "./crunchCard";
import type { CrunchState } from "../domain/types";
import type { CrunchCardBadge } from "./crunchCard";

const STATE_BADGES: Record<CrunchState, CrunchCardBadge> = {
  Created: { label: "Created", variant: "secondary" },
  Started: { label: "Started", variant: "success" },
  Ended: { label: "Ended", variant: "outline" },
  MarginPaidout: { label: "Margin Paidout", variant: "warning" },
  Drained: { label: "Drained", variant: "destructive" },
};

export function CoordinatorCrunches() {
  const { coordinator, coordinatorLoading } = useGetCoordinator();
  const { addressToSlug } = useLocalAddressMap();

  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator?.address ? { coordinator: coordinator.address } : undefined
  );

  if (coordinatorLoading || crunchesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Onchain Crunches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Onchain Crunches</CardTitle>
      </CardHeader>
      <CardContent>
        {crunches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground mb-4">
              You didn&apos;t create any crunches yet, create your first one!
            </p>
            <Link href={INTERNAL_LINKS.CREATE_CRUNCH}>
              <Button>Create your First Crunch</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {crunches.map((crunch) => {
              const slug = addressToSlug[crunch.address];
              return (
                <CrunchCard
                  key={crunch.name}
                  name={crunch.name}
                  address={crunch.address}
                  badge={crunch.state ? STATE_BADGES[crunch.state] : undefined}
                  crunchersCount={crunch.crunchers?.length}
                  payoutAmount={crunch.payoutAmount}
                  href={
                    slug
                      ? generateLink(INTERNAL_LINKS.CRUNCH, {
                          crunchname: slug,
                        })
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
