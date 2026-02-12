import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import { Widget } from "@coordinator/metrics/src/domain/types";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

type ReportSchemaResponse = {
  schema_version?: string;
  leaderboard_columns?: LeaderboardColumn[];
  metrics_widgets?: Widget[];
};

const EDITABLE_LEADERBOARD_FIELDS: (keyof LeaderboardColumn)[] = [
  "displayName",
  "tooltip",
  "format",
  "nativeConfiguration",
  "order",
  "type",
];

export async function fetchReportSchema(): Promise<ReportSchemaResponse | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_URL;
  const endpoint = `${baseUrl.replace(/\/$/, "")}/reports/schema`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.warn(
        `[report-schema] backend schema endpoint returned status ${response.status}`
      );
      return null;
    }

    const payload = (await response.json()) as ReportSchemaResponse;
    if (!payload || typeof payload !== "object") {
      return null;
    }

    return payload;
  } catch (error) {
    console.warn("[report-schema] failed to fetch backend schema", error);
    return null;
  }
}

export function mergeLeaderboardColumns(
  backendColumns: LeaderboardColumn[],
  overrideColumns: LeaderboardColumn[]
): LeaderboardColumn[] {
  const overridesByProperty = new Map(
    overrideColumns.map((column) => [column.property, column])
  );

  const merged = backendColumns.map((column, index) => {
    const override = overridesByProperty.get(column.property);
    if (!override) {
      return { ...column, order: column.order ?? (index + 1) * 10 };
    }

    const result: LeaderboardColumn = { ...column };
    for (const field of EDITABLE_LEADERBOARD_FIELDS) {
      const value = override[field];
      if (value !== undefined) {
        (result[field] as unknown) = value;
      }
    }

    if (override.id !== undefined) {
      result.id = override.id;
    }

    return result;
  });

  const backendProperties = new Set(backendColumns.map((column) => column.property));
  const unknownOverrides = overrideColumns.filter(
    (column) => !backendProperties.has(column.property)
  );

  if (unknownOverrides.length > 0) {
    const properties = unknownOverrides.map((column) => column.property).join(", ");
    console.warn(
      `[report-schema] leaderboard override contains fields not present in backend schema: ${properties}`
    );

    // Keep custom extra columns so existing customization is not lost.
    merged.push(...unknownOverrides);
  }

  return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function mergeMetricsWidgets(
  backendWidgets: Widget[],
  overrideWidgets: Widget[]
): Widget[] {
  const overridesById = new Map(overrideWidgets.map((widget) => [widget.id, widget]));
  const overridesByEndpoint = new Map(
    overrideWidgets.map((widget) => [widget.endpointUrl, widget])
  );

  const merged = backendWidgets.map((widget, index) => {
    const override =
      overridesById.get(widget.id) || overridesByEndpoint.get(widget.endpointUrl);

    if (!override) {
      return { ...widget, order: widget.order ?? (index + 1) * 10 };
    }

    return deepMerge(widget, override) as Widget;
  });

  const backendIds = new Set(backendWidgets.map((widget) => widget.id));
  const backendEndpoints = new Set(
    backendWidgets.map((widget) => widget.endpointUrl)
  );

  const unknownOverrides = overrideWidgets.filter(
    (widget) =>
      !backendIds.has(widget.id) && !backendEndpoints.has(widget.endpointUrl)
  );

  if (unknownOverrides.length > 0) {
    const endpoints = unknownOverrides
      .map((widget) => widget.endpointUrl)
      .join(", ");
    console.warn(
      `[report-schema] metric widget overrides not present in backend schema: ${endpoints}`
    );

    merged.push(...unknownOverrides);
  }

  return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function deepMerge(base: unknown, override: unknown): unknown {
  if (override === undefined) {
    return base;
  }

  if (Array.isArray(base) && Array.isArray(override)) {
    return override;
  }

  if (isRecord(base) && isRecord(override)) {
    const merged: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      merged[key] = deepMerge(base[key], value);
    }
    return merged;
  }

  return override;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
