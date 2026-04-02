import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";

const DEFAULT_BACKEND_URL = "http://localhost:8000";

type ReportSchemaResponse = {
  schema_version?: string;
  leaderboard_columns?: LeaderboardColumn[];
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

  const backendProperties = new Set(
    backendColumns.map((column) => column.property)
  );
  const unknownOverrides = overrideColumns.filter(
    (column) => !backendProperties.has(column.property)
  );

  if (unknownOverrides.length > 0) {
    const properties = unknownOverrides
      .map((column) => column.property)
      .join(", ");
    console.warn(
      `[report-schema] leaderboard override contains fields not present in backend schema: ${properties}`
    );

    merged.push(...unknownOverrides);
  }

  return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
