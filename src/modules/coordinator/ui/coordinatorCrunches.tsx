"use client";
import {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!crunches || crunches.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No Crunches</p>
        </CardContent>
      </Card>
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
