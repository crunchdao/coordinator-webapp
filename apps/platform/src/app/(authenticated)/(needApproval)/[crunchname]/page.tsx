"use client";
import Image from "next/image";
import { CrunchOverview } from "@/modules/crunch/ui/crunchOverview";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

export default function CrunchOverviewPage() {
  const { crunchName } = useCrunchContext();
  return (
    <>
      <section className="relative flex items-end justify-start">
        <h1 className="z-10 absolute display font-bold p-6">{crunchName}</h1>
        <Image
          src="/images/banner.webp"
          alt={crunchName}
          width={1280}
          height={900}
          className="w-full object-cover object-center max-h-[290px] transition-opacity duration-300"
          priority
        />
        <div className="absolute h-1/2 w-full bg-gradient-to-t from-background to-transparent bottom-0" />
      </section>
      <section className="p-6 pt-0">
        <CrunchOverview />
      </section>
    </>
  );
}
