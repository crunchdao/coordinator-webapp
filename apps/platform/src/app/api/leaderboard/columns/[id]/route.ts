import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";

const CONFIG_FILE = path.join(
  process.cwd(),
  "config",
  "leaderboard-columns.json"
);

async function readColumns(): Promise<LeaderboardColumn[]> {
  const data = await fs.readFile(CONFIG_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeColumns(columns: LeaderboardColumn[]): Promise<void> {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(columns, null, 2), "utf-8");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const columnData: Omit<LeaderboardColumn, "id"> = await request.json();

    const columns = await readColumns();
    const index = columns.findIndex((col) => col.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const updatedColumn: LeaderboardColumn = { ...columnData, id };
    columns[index] = updatedColumn;
    await writeColumns(columns);

    return NextResponse.json(updatedColumn);
  } catch (error) {
    console.error("Error updating column:", error);
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const columns = await readColumns();
    const filteredColumns = columns.filter((col) => col.id !== id);

    if (columns.length === filteredColumns.length) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    await writeColumns(filteredColumns);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting column:", error);
    return NextResponse.json(
      { error: "Failed to delete column" },
      { status: 500 }
    );
  }
}
