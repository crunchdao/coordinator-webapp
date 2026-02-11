import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Widget } from "@coordinator/metrics/src/domain/types";
import { initialConfig } from "@coordinator/metrics/src/domain/initial-config";
import { fetchReportSchema, mergeMetricsWidgets } from "@/app/api/_lib/reportSchema";

const CONFIG_FILE = path.join(process.cwd(), "config", "metrics-widgets.json");

async function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readOverrideWidgets(): Promise<Widget[]> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return initialConfig;
    }
    throw error;
  }
}

async function getEffectiveWidgets(): Promise<Widget[]> {
  const overrideWidgets = await readOverrideWidgets();
  const schema = await fetchReportSchema();
  const backendWidgets = schema?.metrics_widgets || initialConfig;
  return mergeMetricsWidgets(backendWidgets, overrideWidgets);
}

async function writeWidgets(widgets: Widget[]): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(widgets, null, 2), "utf-8");
}

export async function GET() {
  try {
    const effectiveWidgets = await getEffectiveWidgets();

    // Ensure override file exists for UI edits.
    await writeWidgets(effectiveWidgets);

    return NextResponse.json(effectiveWidgets);
  } catch (error) {
    console.error("Error reading metrics widgets:", error);
    return NextResponse.json(
      { error: "Failed to read metrics widgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const widgetData: Omit<Widget, "id"> = await request.json();
    const widgets = await readOverrideWidgets();

    const newWidget: Widget = {
      ...widgetData,
      id: Math.max(...widgets.map((widget) => widget.id), 0) + 1,
    };

    const updatedWidgets = [...widgets, newWidget];
    await writeWidgets(updatedWidgets);
    return NextResponse.json(newWidget);
  } catch (error) {
    console.error("Error creating widget:", error);
    return NextResponse.json(
      { error: "Failed to create widget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const widgets: Widget[] = await request.json();
    await writeWidgets(widgets);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing metrics widgets:", error);
    return NextResponse.json(
      { error: "Failed to save metrics widgets" },
      { status: 500 }
    );
  }
}
