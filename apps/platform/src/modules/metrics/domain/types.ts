import type { Widget } from "@coordinator/metrics/src/domain/types";

export type HubChartDefinition = {
  id: number;
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  dataKey: string;
  projectIdProperty: string;
  nativeConfiguration: Record<string, unknown> | null;
  order: number;
};

export type CreateChartDefinitionPayload = {
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  projectIdProperty: string;
  nativeConfiguration: Record<string, unknown> | null;
  order: number;
};

export type UpdateChartDefinitionPayload = Partial<CreateChartDefinitionPayload>;
