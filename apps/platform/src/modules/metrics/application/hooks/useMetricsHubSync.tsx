import { useState } from "react";
import type { Widget } from "@coordinator/metrics/src/domain/types";
import {
  getChartDefinitions,
  createChartDefinition,
  updateChartDefinition,
  deleteChartDefinition,
} from "../../infrastructure/services";
import type { HubChartDefinition } from "../../domain/types";

export const useMetricsHubSync = () => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (address: string, hubBaseUrl: string) => {
    setIsPulling(true);
    try {
      const definitions = await getChartDefinitions(
        `onchain:${address}`,
        hubBaseUrl
      );
      return {
        widgets: definitions.map(
          (def): Widget => ({
            id: def.id,
            displayName: def.displayName,
            type: def.type,
            endpointUrl: def.endpointUrl,
            order: def.order,
            nativeConfiguration: def.nativeConfiguration,
          })
        ),
      };
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    widgets: Widget[]
  ) => {
    setIsPushing(true);
    try {
      const competitionId = `onchain:${address}`;
      const existing = await getChartDefinitions(competitionId, hubBaseUrl);
      const hubByName = new Map(existing.map((d) => [d.name, d]));

      for (const widget of widgets) {
        const name = widget.displayName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const payload = {
          name,
          displayName: widget.displayName,
          type: widget.type,
          endpointUrl: widget.endpointUrl,
          projectIdProperty: "",
          nativeConfiguration:
            "nativeConfiguration" in widget
              ? widget.nativeConfiguration
              : undefined,
          order: widget.order,
        };

        if (hubByName.has(name)) {
          const { name: _, ...updatePayload } = payload;
          await updateChartDefinition(
            competitionId,
            name,
            updatePayload,
            hubBaseUrl
          );
          hubByName.delete(name);
        } else {
          await createChartDefinition(competitionId, payload, hubBaseUrl);
        }
      }

      // Delete hub definitions that no longer exist locally
      for (const [name] of hubByName) {
        await deleteChartDefinition(competitionId, name, hubBaseUrl);
      }
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
