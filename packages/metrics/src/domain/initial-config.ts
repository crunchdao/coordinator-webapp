import { Widget } from "./types";

export const initialConfig: Widget[] = [
  {
    id: 1,
    type: "CHART",
    displayName: "Score Metrics",
    tooltip: "Rolling score windows over time across all models.",
    order: 10,
    endpointUrl: "/reports/models/global",
    nativeConfiguration: {
      type: "line",
      xAxis: {
        name: "performed_at",
      },
      yAxis: {
        series: [
          { name: "score_recent", label: "Recent Score" },
          { name: "score_steady", label: "Steady Score" },
          { name: "score_anchor", label: "Anchor Score" },
        ],
        format: "decimal-2",
      },
      displayEvolution: false,
    },
  },
  {
    id: 2,
    type: "CHART",
    displayName: "Multi-Metric Overview",
    tooltip:
      "Snapshot comparison of key metrics (IC, Sharpe, etc.) per model at the latest checkpoint.",
    order: 15,
    endpointUrl: "/reports/snapshots",
    nativeConfiguration: {
      type: "bar",
      categoryProperty: "metric",
      valueProperties: [{ name: "value", label: "Value" }],
      format: "decimal-4",
      stacked: false,
      horizontal: false,
      groupByProperty: "model_id",
      filterConfig: [
        {
          type: "select",
          label: "Checkpoint",
          property: "checkpoint_id",
          autoSelectFirst: true,
        },
      ],
    },
  },
  {
    id: 3,
    type: "CHART",
    displayName: "Rolling score by parameters",
    tooltip: "Score breakdown by subject and horizon over time.",
    order: 20,
    endpointUrl: "/reports/models/params",
    nativeConfiguration: {
      type: "line",
      xAxis: { name: "performed_at" },
      yAxis: {
        series: [
          { name: "score_recent", label: "Recent Score" },
          { name: "score_steady", label: "Steady Score" },
          { name: "score_anchor", label: "Anchor Score" },
        ],
        format: "decimal-2",
      },
      filterConfig: [
        {
          type: "select",
          label: "Asset",
          property: "asset",
          autoSelectFirst: true,
        },
        {
          type: "select",
          label: "Horizon",
          property: "horizon",
          autoSelectFirst: true,
        },
      ],
      groupByProperty: "param",
      displayEvolution: false,
    },
  },
  {
    id: 4,
    type: "CHART",
    displayName: "Ensemble Performance",
    tooltip: "Ensemble metrics tracked over time.",
    order: 25,
    endpointUrl: "/reports/ensemble/history",
    nativeConfiguration: {
      type: "line",
      xAxis: { name: "performed_at" },
      yAxis: {
        series: [
          { name: "score_recent", label: "Recent Score" },
          { name: "score_steady", label: "Steady Score" },
          { name: "score_anchor", label: "Anchor Score" },
        ],
        format: "decimal-2",
      },
      displayEvolution: true,
    },
  },
  {
    id: 5,
    type: "CHART",
    displayName: "Predictions",
    tooltip: "Individual prediction scores over time, filterable by asset and horizon.",
    order: 30,
    endpointUrl: "/reports/predictions",
    nativeConfiguration: {
      type: "line",
      xAxis: { name: "performed_at" },
      yAxis: {
        series: [{ name: "score_value" }],
        format: "decimal-2",
      },
      alertConfig: {
        reasonField: "score_failed_reason",
        field: "score_success",
      },
      filterConfig: [
        {
          type: "select",
          label: "Asset",
          property: "asset",
          autoSelectFirst: true,
        },
        {
          type: "select",
          label: "Horizon",
          property: "horizon",
          autoSelectFirst: true,
        },
      ],
      groupByProperty: "param",
      displayEvolution: false,
    },
  },
  {
    id: 6,
    type: "CHART",
    displayName: "Reward History",
    tooltip: "Reward percentage earned per model at each checkpoint.",
    order: 35,
    endpointUrl: "/reports/checkpoints/rewards",
    nativeConfiguration: {
      type: "bar",
      categoryProperty: "checkpoint_id",
      valueProperties: [{ name: "reward_pct", label: "Reward %" }],
      format: "percentage",
      stacked: false,
      horizontal: false,
      groupByProperty: "model_id",
    },
  },
];
