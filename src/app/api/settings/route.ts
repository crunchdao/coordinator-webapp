import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { initialSettings } from "@/modules/settings/domain/initial-config";
import { GlobalSettings } from "@/modules/settings/domain/types";
import { globalSettingsSchema } from "@/modules/settings/application/schemas/settingsSchema";
import { checkApiEnvironment } from "@/utils/api-environment-check";

const CONFIG_FILE = path.join(
  process.cwd(),
  "config",
  "global-settings.json"
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
    const settings: GlobalSettings = JSON.parse(data);
    return NextResponse.json(settings);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      try {
        await ensureConfigDir();
        await fs.writeFile(
          CONFIG_FILE,
          JSON.stringify(initialSettings, null, 2),
          "utf-8"
        );
        return NextResponse.json(initialSettings);
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

async function readSettings(): Promise<GlobalSettings> {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await ensureConfigDir();
      await fs.writeFile(
        CONFIG_FILE,
        JSON.stringify(initialSettings, null, 2),
        "utf-8"
      );
      return initialSettings;
    }
    throw error;
  }
}

async function writeSettings(settings: GlobalSettings): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function PUT(request: NextRequest) {
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  try {
    const body = await request.json();
    
    const validatedSettings = globalSettingsSchema.parse(body);
    
    await writeSettings(validatedSettings);
    
    return NextResponse.json(validatedSettings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}