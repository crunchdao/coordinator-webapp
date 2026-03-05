"use client";

import Link from "next/link";
import { generateLink } from "@crunch-ui/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@crunch-ui/core";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useCompetitionEnvironments } from "../application/hooks/useCompetitionEnvironments";
import { useCompetitionSettings } from "../application/hooks/useCompetitionSettings";

interface CompetitionCardProps {
  slug: string;
}

export function CompetitionCard({ slug }: CompetitionCardProps) {
  const { settings } = useCompetitionSettings(slug);
  const { environments } = useCompetitionEnvironments(slug);

  const displayName = settings?.displayName || slug;
  const shortDescription = settings?.shortDescription;

  return (
    <Link href={generateLink(INTERNAL_LINKS.CRUNCH, { crunchname: slug })}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="text-base">{displayName}</CardTitle>
          {shortDescription && (
            <p className="text-sm text-muted-foreground">{shortDescription}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {environments && environments.length > 0 ? (
              environments.map((env) => (
                <Badge key={env.name} variant="secondary" size="sm">
                  {env.name} ({env.network})
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">
                No environments configured
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
