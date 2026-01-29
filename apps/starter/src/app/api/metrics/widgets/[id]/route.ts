import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Widget } from "@coordinator/metrics/src/domain/types";

const CONFIG_FILE = path.join(process.cwd(), "config", "metrics-widgets.json");

async function readWidgets(): Promise<Widget[]> {
  const data = await fs.readFile(CONFIG_FILE, "utf-8");
  return JSON.parse(data);
}

async function writeWidgets(widgets: Widget[]): Promise<void> {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(widgets, null, 2), "utf-8");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const widgetData: Omit<Widget, "id"> = await request.json();

    const widgets = await readWidgets();
    const index = widgets.findIndex((w) => w.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    const updatedWidget: Widget = { ...widgetData, id };
    widgets[index] = updatedWidget;
    await writeWidgets(widgets);

    return NextResponse.json(updatedWidget);
  } catch (error) {
    console.error("Error updating widget:", error);
    return NextResponse.json(
      { error: "Failed to update widget" },
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
    const widgets = await readWidgets();
    const filteredWidgets = widgets.filter((w) => w.id !== id);

    if (widgets.length === filteredWidgets.length) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    await writeWidgets(filteredWidgets);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting widget:", error);
    return NextResponse.json(
      { error: "Failed to delete widget" },
      { status: 500 }
    );
  }
}
