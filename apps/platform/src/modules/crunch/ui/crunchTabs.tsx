"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@crunch-ui/core";
import { useCrunchContext } from "../application/context/crunchContext";
import { CrunchOverview } from "./crunchOverview";
import { CompetitionSettingsTab } from "@/modules/competition/ui/competitionSettingsTab";

export function CrunchTabs() {
  const { crunchData } = useCrunchContext();

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Crunch Protocol</TabsTrigger>
        <TabsTrigger value="competition">Competition</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <CrunchOverview />
      </TabsContent>
      <TabsContent value="competition" className="mt-4">
        {crunchData?.address && (
          <CompetitionSettingsTab crunchAddress={crunchData.address} />
        )}
      </TabsContent>
    </Tabs>
  );
}
