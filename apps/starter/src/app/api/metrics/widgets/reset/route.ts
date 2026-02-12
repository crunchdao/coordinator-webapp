import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { initialConfig } from "@coordinator/metrics/src/domain/initial-config";
import { fetchReportSchema } from "@/app/api/_lib/reportSchema";

const CONFIG_FILE = path.join(process.cwd(), "config", "metrics-widgets.json");

async function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function POST() {
  try {
    const schema = await fetchReportSchema();
    const backendWidgets = schema?.metrics_widgets || initialConfig;

    await ensureConfigDir();
    await fs.writeFile(
      CONFIG_FILE,
      JSON.stringify(backendWidgets, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting widgets:", error);
    return NextResponse.json(
      { error: "Failed to reset widgets" },
      { status: 500 }
    );
  }
}
