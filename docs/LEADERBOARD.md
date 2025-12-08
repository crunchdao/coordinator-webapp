# Leaderboard Configuration Guide

This document describes the configuration options for columns in the leaderboard system.

## Column Types

- **MODEL**: Model identifiers with optional status indicators
- **VALUE**: Numeric values with formatting options
- **CHART**: Inline gauge visualizations
- **USERNAME**: User identification text

## Column Configuration

```typescript
{
  id: number,
  type: "MODEL" | "VALUE" | "CHART" | "USERNAME",
  property: string,              // Data property to display
  displayName: string,           // Column header
  tooltip?: string | null,       // Optional tooltip
  format?: FormatType | null,    // Number formatting (VALUE only)
  nativeConfiguration?: object | null,  // Type-specific config
  order: number                  // Display order (lower = left)
}
```

### MODEL Configuration

```typescript
nativeConfiguration: {
  type: "model",
  statusProperty?: string        // Shows status indicator when true/"active"
}
```

### VALUE Configuration

No special configuration needed. Supports these formats:
- `"percentage"` - Decimal to percentage (0.95 → 95.00%)
- `"integer"` - Rounded with thousand separators
- `"compact"` - Compact notation (1234 → 1.2K)
- `"number"` - Standard number formatting
- `"decimal-1"` to `"decimal-4"` - Fixed decimal places

### CHART Configuration

```typescript
nativeConfiguration: {
  type: "gauge",
  percentage?: boolean,
  seriesConfig?: Array<{
    name?: string,              // Data property
    color?: string,             // "orange", "yellow", "green", "red"
    label?: string              // Display label
  }>
}
```

### USERNAME Configuration

No special configuration or formatting.

## Data Format

```typescript
type LeaderboardPosition = Record<string, unknown>;
type Leaderboard = LeaderboardPosition[];
```

Configuration file: `config/leaderboard-columns.json`