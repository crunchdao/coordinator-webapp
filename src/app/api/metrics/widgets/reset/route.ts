import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

export async function POST() {
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  try {
    await ensureConfigDir();
    await fs.writeFile(
      CONFIG_FILE,
      JSON.stringify(initialConfig, null, 2),
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