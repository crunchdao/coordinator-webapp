"use client";

import { generateLink } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { CrunchCard } from "@/modules/crunch/ui/crunchCard";
import { useLocalCompetitionEnvironments } from "../application/hooks/useLocalCompetitionEnvironments";
import { useLocalCompetitionSettings } from "../application/hooks/useLocalCompetitionSettings";

interface CompetitionCardProps {
  slug: string;
}

export function CompetitionCard({ slug }: CompetitionCardProps) {
  const { settings } = useLocalCompetitionSettings(slug);
  const { environments } = useLocalCompetitionEnvironments(slug);

  const firstEnv = environments?.[0];

  return (
    <CrunchCard
      name={slug}
      displayName={settings?.displayName}
      imageUrl={settings?.cardImageUrl}
      address={firstEnv?.address}
      hubUrl={firstEnv?.hubUrl}
      href={generateLink(INTERNAL_LINKS.CRUNCH, { crunchname: slug })}
    />
  );
}
