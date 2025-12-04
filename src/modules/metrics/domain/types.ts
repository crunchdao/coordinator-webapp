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
};

export type LineChartDefinition = BaseDefinition & {
  nativeConfiguration: LineChartConfiguration | null;
};

export type GaugeDefinition = BaseDefinition & {
  nativeConfiguration: GaugeConfiguration | null;
};

export type IframeChartDefinition = BaseDefinition & {
  nativeConfiguration: {
    url: string;
  };
};

export type MetricDefinition =
  | LineChartDefinition
  | GaugeDefinition
  | IframeChartDefinition;
