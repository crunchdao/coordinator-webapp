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

  return (
    <CrunchCard
      name={slug}
      displayName={settings?.displayName}
      imageUrl={settings?.cardImageUrl}
      environments={environments?.map((env) => ({
        name: env.name,
        address: env.address,
        network: env.network,
      }))}
      href={generateLink(INTERNAL_LINKS.CRUNCH, { crunchname: slug })}
    />
  );
}
