"use client";

import { CrunchOverview } from "@/modules/crunch/ui/crunchOverview";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetCompetition } from "@/modules/competition/application/hooks/useGetCompetition";

const DEFAULT_BANNER_IMAGE = "/images/banner.webp";

export default function CrunchPage() {
  const { crunchName, crunchData } = useCrunchContext();
  const { competition } = useGetCompetition(crunchData?.address);

  const bannerImageUrl = competition?.bannerImageUrl || DEFAULT_BANNER_IMAGE;

  return (
    <>
      <section className="relative flex items-end justify-start">
        <h1 className="z-10 absolute display-sm font-bold px-6 py-12">
          {crunchName}
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImageUrl}
          alt={crunchName}
          className="w-full object-cover object-center max-h-[290px] transition-opacity duration-300"
        />
        <div className="absolute h-1/2 w-full bg-gradient-to-t from-background to-transparent bottom-0" />
      </section>
      <section className="p-6 pt-0">
        <CrunchOverview />
      </section>
    </>
  );
}
