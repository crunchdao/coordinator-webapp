"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { useGetCoordinatorCrunches } from "../application/hooks/useGetCoordinatorCrunches";
import Link from "next/link";
import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";

export function CoordinatorCrunches() {
  const { crunches, crunchesLoading, crunchesPending } =
    useGetCoordinatorCrunches();

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {crunches.map((crunch) => (
        <Link
          key={crunch.name}
          href={generateLink(INTERNAL_LINKS.LEADERBOARD, {
            crunchname: crunch.name,
          })}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crunch.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                <span>Max models per cruncher:</span>{" "}
                {crunch.maxModelsPerCruncher}
              </p>
              OTHERS DETIALS GOES HERE
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
