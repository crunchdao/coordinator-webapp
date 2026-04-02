import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import { initialColumns } from "@coordinator/leaderboard/src/domain/initial-config";
import {
  fetchReportSchema,
  mergeLeaderboardColumns,
} from "@/app/api/_lib/reportSchema";

const CONFIG_FILE = path.join(
  process.cwd(),
  "config",
  "leaderboard-columns.json"
);

async function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getEffectiveColumns(): Promise<LeaderboardColumn[]> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      // First access: merge backend schema with defaults and persist.
      const schema = await fetchReportSchema();
      const backendColumns = schema?.leaderboard_columns || initialColumns;
      const overrideColumns = initialColumns;
      const effective = mergeLeaderboardColumns(backendColumns, overrideColumns);
      await ensureConfigDir();
      await fs.writeFile(CONFIG_FILE, JSON.stringify(effective, null, 2), "utf-8");
      return effective;
    }
    throw error;
  }
}

export async function GET() {
  try {
    const columns = await getEffectiveColumns();
    return NextResponse.json(columns);
  } catch (error) {
    console.error("Error reading leaderboard columns:", error);
    return NextResponse.json(
      { error: "Failed to read leaderboard columns" },
      { status: 500 }
    );
  }
}
