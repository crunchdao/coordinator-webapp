# Realtime Charts Data Models

This document describes the data structures required to configure realtime charts in the project.

## Line Chart

For a `LineChart` widget, you need to provide a `ChartWidget` object with the following structure:

```typescript
{
  id: number,
  name: string,
  type: "CHART",
  projectIdProperty: string,  // Property in data containing project ID
  nativeConfiguration?: {
    xAxis?: { type?: string },
    yAxis?: { type?: string }
  },
  data: Array<{              // Data array
    [key: string]: string | number | null | undefined
  }>,
  definitions: Array<{       // Chart configurations
    id: number,
    name: string,
    displayName: string,     // Display name in UI
    tooltip?: string,        // Optional tooltip
    order: number,           // Display order
    nativeConfiguration: {
      xAxis: { name: string },     // Property for X axis
      yAxis: { name: string, format?: string } |     // Property for Y axis (single) with optional formatting
             { names: string[], format?: string },   // or multiple for multiple series with optional formatting
      displayEvolution: boolean,    // Show evolution in the legend
      displayLegend?: boolean,      // Show/hide legend (default: true)
      tooltip?: string,             // Optional tooltip displayed near the title
      groupByProperty?: string,     // Optional property to create additional grouping dimension
      alertConfig?: {               // Optional alert detection configuration
        field: string,              // Field to check (when true, displays alert)
        reasonField: string         // Field containing the alert reason
      },
      filterConfig?: [{             // Optional filter configuration
        property: string,           // Data property to filter by
        label: string,              // Display label for the filter
        type: "select" | "multiselect"  // Filter UI type
      }],
      seriesConfig?: {              // Optional per-series config
        [seriesName: string]: {
          color?: string,           // Series color
          label?: string            // Custom label
        }
      }
    }
  }>
}
```

### Y-Axis Formatting

The `format` field in `yAxis` supports the following values:
- `"percentage"` - Appends % to the value (e.g., 95.5 → 95.5%)
- `"currency"` - Formats as currency with $ prefix (e.g., 1234 → $1,234)
- `"decimal"` - Formats to 2 decimal places (e.g., 1.23456 → 1.23)

### Grouping by Multiple Dimensions

Use `groupByProperty` to create separate lines based on an additional property. For example, if you have data with both `model_id` and `param`, you can group by `param` to create separate lines for each parameter value within each model.

### Alert Detection

Configure `alertConfig` to automatically detect and display alerts on the chart:
- Alert points will be marked with red dots when the field is true
- Hover over alert points to see the alert reason
- Requires a boolean field to trigger alerts and a string field for the reason

Example configuration:
```json
"alertConfig": {
  "field": "score_failed",
  "reasonField": "score_failed_reason"
}
```

### Data Filtering

Configure `filterConfig` to add interactive filters above the chart:
- `select`: Single value dropdown filter
- `multiselect`: Multiple value selection (coming soon)

The filters automatically extract unique values from the data and allow users to filter the displayed information.

Example configuration:
```json
"filterConfig": [
  {
    "property": "asset",
    "label": "Asset",
    "type": "select"
  },
  {
    "property": "param",
    "label": "Parameter",
    "type": "select"
  }
]
```

### Line Chart Example

```json
{
  "id": 1,
  "name": "Performance Metrics",
  "type": "CHART",
  "projectIdProperty": "projectId",
  "data": [
    { "projectId": 123, "timestamp": "2024-01-01T00:00:00", "value": 95.5, "accuracy": 0.87 },
    { "projectId": 123, "timestamp": "2024-01-02T00:00:00", "value": 97.2, "accuracy": 0.89 }
  ],
  "definitions": [{
    "id": 1,
    "name": "performance_chart",
    "displayName": "Performance Over Time",
    "order": 1,
    "nativeConfiguration": {
      "xAxis": { "name": "timestamp" },
      "yAxis": { "names": ["value", "accuracy"], "format": "percentage" },
      "displayEvolution": true,
      "seriesConfig": {
        "value": { "color": "#3B82F6", "label": "Performance %" },
        "accuracy": { "color": "#10B981", "label": "Accuracy" }
      }
    }
  }]
}
```

## Iframe

For an `Iframe` widget, you need to provide a `ChartIframeWidget` object:

```typescript
{
  id: number,
  name: string,
  type: "IFRAME",
  definitions: {
    id: number,
    name: string,
    displayName: string,     // Display name in UI
    tooltip?: string,        // Optional tooltip
    order: number,           // Display order
    nativeConfiguration: {
      url: string            // Iframe URL to display
    }
  }
}
```

### Iframe Example

```json
{
  "id": 2,
  "name": "External Dashboard",
  "type": "IFRAME",
  "definitions": {
    "id": 1,
    "name": "grafana_dashboard",
    "displayName": "Grafana Metrics",
    "order": 2,
    "nativeConfiguration": {
      "url": "https://grafana.example.com/d/dashboard-id/metrics?orgId=1"
    }
  }
}
```
