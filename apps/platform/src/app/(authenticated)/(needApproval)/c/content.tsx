"use client";

import { useRouter } from "next/navigation";
import { Button, Spinner } from "@crunch-ui/core";
import { Plus } from "@crunch-ui/icons";
import { useCompetitionList } from "@/modules/config/application/hooks/useCompetitionList";
import { CompetitionCard } from "@/modules/config/ui/competitionCard";

export function CompetitionsContent() {
  const router = useRouter();
  const { slugs, competitionsLoading } = useCompetitionList();

  if (competitionsLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Configured Crunches</h1>
        <Button onClick={() => router.push("/c/new")}>
          <Plus className="size-4 mr-2" />
          New Crunch
        </Button>
      </div>

      {slugs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground mb-4">
            No competitions configured yet.
          </p>
          <Button onClick={() => router.push("/c/new")}>
            <Plus className="size-4 mr-2" />
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
    </div>
  );
}
