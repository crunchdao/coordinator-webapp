import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { initialSettings } from "@coordinator/settings/src/domain/initial-config";
import { GlobalSettings } from "@coordinator/settings/src/domain/types";
import { globalSettingsSchema } from "@coordinator/settings/src/application/schemas/settingsSchema";

const CONFIG_FILE = path.join(process.cwd(), "config", "global-settings.json");

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
    const savedSettings: GlobalSettings = JSON.parse(data);
    // Merge with initial settings to pick up new fields
    const settings: GlobalSettings = {
      ...initialSettings,
      ...savedSettings,
      // Deep merge nested objects
      endpoints: { ...initialSettings.endpoints, ...savedSettings.endpoints },
      logs: { ...initialSettings.logs, ...savedSettings.logs },
    };
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
async function writeSettings(settings: GlobalSettings): Promise<void> {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function PUT(request: NextRequest) {
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
