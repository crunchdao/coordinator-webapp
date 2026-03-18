"use client";

import Link from "next/link";
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
import { INTERNAL_LINKS } from "@/utils/routes";
import { CompetitionCard } from "./competitionCard";

export function CompetitionList() {
  const { slugs, competitionsLoading } = useLocalCompetitionList();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Local Crunches</CardTitle>
        {!competitionsLoading && (
          <Link href={INTERNAL_LINKS.CREATE_LOCAL_CRUNCH}>
            <Button size="sm">
              <Plus />
              New Crunch
            </Button>
          </Link>
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
            <Link href={INTERNAL_LINKS.CREATE_LOCAL_CRUNCH}>
              <Button>
                <Plus />
                Create your first competition
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
            {slugs.map((slug) => (
              <CompetitionCard key={slug} slug={slug} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
