import {
  GaugeConfiguration,
  LineChartConfiguration,
} from "@/modules/chart/domain/types";

export type MetricType = "CHART" | "IFRAME";

export type MetricItem = {
  [key: string]: string | number | null | boolean | undefined;
};

export type BaseDefinition = {
  id: number;
  name: string;
  type: MetricType;
  displayName: string;
  tooltip?: string | null;
  order: number;
  endpointUrl: string;
};

export type LineChartDefinition = BaseDefinition & {
  nativeConfiguration: LineChartConfiguration | null;
};

export type GaugeDefinition = BaseDefinition & {
  nativeConfiguration: GaugeConfiguration | null;
};

export type IframeChartDefinition = BaseDefinition;

export type Widget =
  | LineChartDefinition
  | GaugeDefinition
  | IframeChartDefinition;

export interface GetMetricDataParams {
  modelIds: string[];
  start: string;
  end: string;
}
