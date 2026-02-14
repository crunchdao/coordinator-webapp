# New Dashboard Widgets — Design & Integration

**Date:** 2026-02-14
**Branch:** `feat/new-dashboard-widgets`

## Summary

Integrates three new coordinator endpoints into the metrics dashboard, adding a local `BarChart` component to support bar-type visualizations alongside the existing line and gauge charts.

## New Endpoints & Widgets

| # | Widget | Endpoint | Chart Type | Default Order |
|---|--------|----------|------------|---------------|
| 1 | Score Metrics | `/reports/models/global` | Line | 10 |
| **2** | **Multi-Metric Overview** | **`/reports/snapshots`** | **Bar** | **15** |
| 3 | Rolling by Params | `/reports/models/params` | Line | 20 |
| **4** | **Ensemble Performance** | **`/reports/ensemble/history`** | **Line** | **25** |
| 5 | Predictions | `/reports/predictions` | Line | 30 |
| **6** | **Reward History** | **`/reports/checkpoints/rewards`** | **Bar** | **35** |

Bold rows are new.

## Architecture Decisions

### Why a local BarChart instead of extending @crunchdao/chart?

`@crunchdao/chart` only supports `line` and `gauge`. Adding `bar` there requires a library release cycle. Instead:

- **Local `BarChart`** in `packages/metrics/src/ui/barChart.tsx` uses Chart.js directly (already a dependency).
- **Same styling** — reads CSS custom properties for grid/tick colors, same zoom plugin, same filter support.
- **Promotion path** — once stable, extract to `@crunchdao/chart` as a `bar` chart type.

### How bar charts integrate with MetricsDashboard

The `MetricsDashboard` intercepts widgets whose `nativeConfiguration.type === "bar"` before they reach `MetricWidget` (from `@crunchdao/chart`). Bar widgets render through a local `BarChartWidget` wrapper that handles filters and tooltips identically to line chart widgets.

## Type System Changes

```
BarChartConfiguration {
  type: "bar"
  categoryProperty: string        // field for bar labels
  valueProperties: { name, label?, color? }[]  // numeric fields to plot
  format?: FormatType             // axis/tooltip number format
  stacked?: boolean
  horizontal?: boolean
  groupByProperty?: string        // group rows into categories
  filterConfig?: FilterConfig[]
  noDataMessage?: string
}
```

`Widget` union type expanded: `LineChartDefinition | GaugeDefinition | BarChartDefinition | IframeChartDefinition`

## Form Support

- Chart type selector now includes "Bar Chart"
- `BarChartFields` component: category property, value properties (add/remove), format, stacked, horizontal, group-by, filters
- Schema validation requires `categoryProperty` + at least one `valueProperty` for bar charts

## Files Changed

| File | Change |
|------|--------|
| `packages/metrics/src/domain/types.ts` | Added `BarChartConfiguration`, `BarChartDefinition` |
| `packages/metrics/src/domain/initial-config.ts` | Added 3 new widgets, reordered |
| `packages/metrics/src/ui/barChart.tsx` | **New** — Chart.js bar chart component |
| `packages/metrics/src/ui/barChartFields.tsx` | **New** — form fields for bar chart config |
| `packages/metrics/src/ui/metricsDashboard.tsx` | Bar chart rendering + `BarChartWidget` wrapper |
| `packages/metrics/src/ui/addWidgetForm.tsx` | Bar chart type in selector, submit handler, edit hydration |
| `packages/metrics/src/application/schemas/widgetFormSchema.ts` | `bar` chart type + validation |
| `packages/metrics/src/application/hooks/useMetricData.tsx` | `BarChartDefinition` in type union |
