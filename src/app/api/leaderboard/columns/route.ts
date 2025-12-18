import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardColumn } from "@/modules/leaderboard/domain/types";
import { initialColumns } from "@/modules/leaderboard/domain/initial-config";

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

export async function GET() {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    const columns: LeaderboardColumn[] = JSON.parse(data);
    return NextResponse.json(columns);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      try {
        await ensureConfigDir();
        await fs.writeFile(
          CONFIG_FILE,
          JSON.stringify(initialColumns, null, 2),
          "utf-8"
        );
        return NextResponse.json(initialColumns);
      } catch (writeError) {
        console.error("Error creating initial configuration:", writeError);
        return NextResponse.json(
          { error: "Failed to create initial configuration" },
          { status: 500 }
        );
      }
    }
    console.error("Error reading configuration:", error);
    return NextResponse.json(
      { error: "Failed to read configuration" },
      { status: 500 }
    );
  }
}

async function readColumns(): Promise<LeaderboardColumn[]> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    const columns = JSON.parse(data);

    return columns;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await ensureConfigDir();
      await fs.writeFile(
        CONFIG_FILE,
        JSON.stringify(initialColumns, null, 2),
        "utf-8"
      );
      return initialColumns;
    }
    throw error;
  }
}

async function writeColumns(columns: LeaderboardColumn[]): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(columns, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const columnData: Omit<LeaderboardColumn, "id"> = await request.json();
    const columns = await readColumns();
    const newColumn: LeaderboardColumn = {
      ...columnData,
      id: Math.max(...columns.map((c) => c.id), 0) + 1,
    };
    const updatedColumns = [...columns, newColumn];
    await writeColumns(updatedColumns);
    return NextResponse.json(newColumn);
  } catch (error) {
    console.error("Error creating column:", error);
    return NextResponse.json(
      { error: "Failed to create column" },
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
    console.error("Error writing configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}
