import { NextRequest, NextResponse } from "next/server";
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

async function readOverrideColumns(): Promise<LeaderboardColumn[]> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return initialColumns;
    }
    throw error;
  }
}

async function getEffectiveColumns(): Promise<LeaderboardColumn[]> {
  const overrideColumns = await readOverrideColumns();
  const schema = await fetchReportSchema();
  const backendColumns = schema?.leaderboard_columns || initialColumns;
  return mergeLeaderboardColumns(backendColumns, overrideColumns);
}

async function writeColumns(columns: LeaderboardColumn[]): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(columns, null, 2), "utf-8");
}

export async function GET() {
  try {
    const effectiveColumns = await getEffectiveColumns();

    // Ensure the override file exists so users can edit from UI immediately.
    await writeColumns(effectiveColumns);

    return NextResponse.json(effectiveColumns);
  } catch (error) {
    console.error("Error reading leaderboard columns:", error);
    return NextResponse.json(
      { error: "Failed to read leaderboard columns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const columnData: Omit<LeaderboardColumn, "id"> = await request.json();
    const columns = await readOverrideColumns();

    const newColumn: LeaderboardColumn = {
      ...columnData,
      id: Math.max(...columns.map((column) => column.id), 0) + 1,
    };

    const updatedColumns = [...columns, newColumn];
    await writeColumns(updatedColumns);
    return NextResponse.json(newColumn);
  } catch (error) {
    console.error("Error creating leaderboard column:", error);
    return NextResponse.json(
      { error: "Failed to create leaderboard column" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const columns: LeaderboardColumn[] = await request.json();
    await writeColumns(columns);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing leaderboard columns:", error);
    return NextResponse.json(
      { error: "Failed to save leaderboard columns" },
      { status: 500 }
    );
  }
}
