"use client";

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@crunch-ui/core";
import { useGetCompetition } from "../application/hooks/useGetCompetition";
import { CompetitionEditForm } from "./competitionEditForm";

interface CompetitionSettingsTabProps {
  crunchAddress: string;
}

export function CompetitionSettingsTab({
  crunchAddress,
}: CompetitionSettingsTabProps) {
  const { competition, competitionLoading, competitionExists } =
    useGetCompetition(crunchAddress);

  if (competitionLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!competition || !competitionExists) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-muted-foreground text-center">
            No competition found for this crunch.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <CompetitionEditForm
          competition={competition}
          competitionIdentifier={`onchain:${crunchAddress}`}
        />
      </CardContent>
    </Card>
  );
}
