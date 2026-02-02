# Charts Configuration Guide

This document describes the data structures and configuration options for charts and widgets in the metrics system.

## Widget Types

The system supports two main widget types:
- **CHART**: Interactive charts (Line Charts, Gauges)
- **IFRAME**: Embedded external content

## Common Widget Properties

All widgets share these base properties:

```typescript
{
  id: number,                     // Unique identifier
  type: "CHART" | "IFRAME",      // Widget type
  displayName: string,            // Display name shown to users
  tooltip?: string | null,        // Optional tooltip
  order: number,                  // Display order (lower numbers appear first)
  endpointUrl: string,           // API endpoint for data
}
```

## Line Chart Configuration

Line charts visualize time-series data with one or more Y-axis series.

### Configuration Structure

```typescript
{
  type: "CHART",
  nativeConfiguration: {
    type: "line",
    xAxis: { 
      name: string              // Property name for X axis (e.g., "performed_at")
    },
    yAxis: {
      series: Array<{           // One or more data series
        name: string,           // Property name in data
        label?: string,         // Display label (optional)
        color?: string          // Series color (optional, e.g., "#FF6B6B")
      }>,
      format?: string           // Value formatting (see formats below)
    },
    displayEvolution: boolean,   // Show evolution percentage
    displayLegend?: boolean,     // Show/hide legend (default: true)
    groupByProperty?: string,    // Group data by this property
    alertConfig?: {              // Alert detection configuration
      field: string,             // Boolean field (true = alert triggered)
      reasonField: string        // Field containing alert reason text
    },
    filterConfig?: Array<{       // Interactive filters
      property: string,          // Data property to filter
      label: string,             // Filter display label
      type: "select",            // Filter type
      autoSelectFirst?: boolean  // Auto-select first value
    }>
  }
}
```

### Y-Axis Formats

- `"decimal-1"` to `"decimal-4"` - Format with fixed decimal places (e.g., 1.23456 → 1.23 for `"decimal-2"`)
- `"percentage"` - Convert decimal to percentage (e.g., 0.955 → 95.50%)
- `"integer"` - Round to integer with thousand separators (e.g., 1234.56 → 1,235)
- `"compact"` - Compact notation (e.g., 1234 → 1.2K, 1234567 → 1.2M)
- `"number"` - Standard number formatting with thousand separators (e.g., 1234.56 → 1,234.56)

### Example: Multi-Series Line Chart

```json
{
  "id": 1,
  "type": "CHART",
  "displayName": "Score Metrics",
  "order": 10,
  "endpointUrl": "/reports/models/global",
  "nativeConfiguration": {
    "type": "line",
    "xAxis": {
      "name": "performed_at"
    },
    "yAxis": {
      "series": [
        { "name": "score_recent", "label": "Recent Score" },
        { "name": "score_steady", "label": "Steady Score" },
        { "name": "score_anchor", "label": "Anchor Score", "color": "#3B82F6" }
      ],
      "format": "decimal-2"
    },
    "displayEvolution": false,
    "displayLegend": true,
    "filterConfig": [
      {
        "property": "asset",
        "label": "Asset",
        "type": "select",
        "autoSelectFirst": true
      }
    ]
  }
}
```

### Example: Single Series with Alerts

```json
{
  "id": 2,
  "type": "CHART",
  "displayName": "Predictions",
  "order": 30,
  "endpointUrl": "/reports/predictions",
  "nativeConfiguration": {
    "type": "line",
    "xAxis": {
      "name": "performed_at"
    },
    "yAxis": {
      "series": [
        { "name": "score_value" }
      ],
      "format": "decimal-2"
    },
    "alertConfig": {
      "field": "score_success",
      "reasonField": "score_failed_reason"
    },
    "groupByProperty": "param",
    "displayEvolution": false
  }
}
```

## Gauge Configuration

Gauges display single numeric values with optional percentage formatting.

### Configuration Structure

```typescript
{
  type: "CHART",
  nativeConfiguration: {
    type: "gauge",
    percentage?: boolean,        // Display as percentage
    filterConfig?: Array<{       // Same as line chart filters
      property: string,
      label: string,
      type: "select",
      autoSelectFirst?: boolean
    }>,
    seriesConfig?: Array<{       // Gauge series configuration
      name?: string,             // Data property name
      color?: string,            // Color: "orange", "yellow", "green", "red"
      label?: string             // Display label
    }>
  }
}
```

## Iframe Widget

Iframe widgets embed external content (dashboards, reports, etc.).

### Configuration Structure

```typescript
{
  id: number,
  type: "IFRAME",
  displayName: string,
  tooltip?: string | null,
  order: number,
  endpointUrl: string            // URL to embed
}
```

## Advanced Features

### Grouping Data

Use `groupByProperty` to create separate series based on a data property. For example, if your data has both `asset` and `param` properties, setting `groupByProperty: "param"` will create separate lines for each unique parameter value.

### Alert Detection

Configure alerts to highlight data points that meet certain conditions:
- Points where the alert field is `true` are marked with red indicators
- Hover over alert points to see the reason
- Useful for highlighting failures or anomalies

### Interactive Filters

Add dropdown filters to allow users to slice data:
- Filters automatically extract unique values from the dataset
- Multiple filters can be combined
- Set `autoSelectFirst: true` to automatically select the first available value, preventing too many series from being displayed.
