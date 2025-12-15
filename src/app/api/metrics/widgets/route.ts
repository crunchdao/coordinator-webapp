import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Widget } from "@/modules/metrics/domain/types";
import { initialConfig } from "@/modules/metrics/domain/initial-config";
import { checkApiEnvironment } from "@/utils/api-environment-check";

const CONFIG_FILE = path.join(
  process.cwd(),
  "config",
  "metrics-widgets.json"
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
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    const widgets: Widget[] = JSON.parse(data);
    return NextResponse.json(widgets);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      try {
        await ensureConfigDir();
        await fs.writeFile(
          CONFIG_FILE,
          JSON.stringify(initialConfig, null, 2),
          "utf-8"
        );
        return NextResponse.json(initialConfig);
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

async function readWidgets(): Promise<Widget[]> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await ensureConfigDir();
      await fs.writeFile(
        CONFIG_FILE,
        JSON.stringify(initialConfig, null, 2),
        "utf-8"
      );
      return initialConfig;
    }
    throw error;
  }
}

async function writeWidgets(widgets: Widget[]): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(widgets, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  try {
    const widgetData: Omit<Widget, "id"> = await request.json();
    const widgets = await readWidgets();
    const newWidget: Widget = {
      ...widgetData,
      id: Math.max(...widgets.map(w => w.id), 0) + 1,
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
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  try {
    const widgets: Widget[] = await request.json();
    await writeWidgets(widgets);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing configuration:", error);
    return NextResponse.json(
      { error: "Failed to save configuration" },
      { status: 500 }
    );
  }
}