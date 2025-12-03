export type GaugeConfiguration = {
  type: "gauge";
  percentage?: boolean;
  seriesConfig?: GaugeSeriesConfig[];
};

export type GaugeSeriesConfig = {
  name?: string;
  color?: string;
  label?: string;
};
