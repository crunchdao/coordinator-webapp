import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONFIG_ROOT = path.join(process.cwd(), "config");

const init = fs.mkdir(path.join(CONFIG_ROOT, "crunches"), { recursive: true });

function resolveConfigPath(segments: string[]): string {
  const resolved = path.resolve(CONFIG_ROOT, ...segments);
  if (!resolved.startsWith(CONFIG_ROOT)) {
    throw new Error("Path traversal detected");
  }
  return resolved;
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    await init;
    const { path: segments } = await params;
    const filePath = resolveConfigPath(segments);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      const entries = await fs.readdir(filePath, { withFileTypes: true });
      return NextResponse.json({
        type: "directory",
        entries: entries.map((e) => ({
          name: e.name,
          type: e.isDirectory() ? "directory" : "file",
        })),
      });
    }

    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      const { path: segments } = await params;
      const filePath = resolveConfigPath(segments);
      if (!filePath.includes(".")) {
        return NextResponse.json({ type: "directory", entries: [] });
      }
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if ((error as Error).message === "Path traversal detected") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    console.error("Config GET error:", error);
    return NextResponse.json(
      { error: "Failed to read config" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const filePath = resolveConfigPath(segments);
    const data = await request.json();

    await ensureDir(filePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json(data);
  } catch (error) {
    if ((error as Error).message === "Path traversal detected") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    console.error("Config PUT error:", error);
    return NextResponse.json(
      { error: "Failed to write config" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const filePath = resolveConfigPath(segments);

    await fs.unlink(filePath);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if ((error as Error).message === "Path traversal detected") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    console.error("Config DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete config" },
      { status: 500 }
    );
  }
}
