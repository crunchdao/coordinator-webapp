"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@crunch-ui/core";
import { Plus } from "@crunch-ui/icons";
import { useLocalCompetitionList } from "../application/hooks/useLocalCompetitionList";
import { CompetitionCard } from "./competitionCard";

export function CompetitionList() {
  const router = useRouter();
  const { slugs, competitionsLoading } = useLocalCompetitionList();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Configured Crunches</CardTitle>
        {!competitionsLoading && (
          <Button size="sm" onClick={() => router.push("/c/new")}>
            <Plus className="size-4" />
            New Crunch
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {competitionsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        ) : slugs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground mb-4">
              No competitions configured yet.
            </p>
            <Button onClick={() => router.push("/c/new")}>
              <Plus className="size-4" />
              Create your first competition
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {slugs.map((slug) => (
              <CompetitionCard key={slug} slug={slug} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
