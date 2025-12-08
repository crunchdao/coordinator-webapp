import { NextRequest } from "next/server";
import { spawn } from "child_process";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ container: string }> }
) {
  const { container } = await params;

  const headers = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    start(controller) {
      const proc = spawn("docker", ["logs", "-f", container]);

      proc.stdout.on("data", (data: Buffer) => {
        const log = {
          timestamp: new Date().toISOString(),
          message: data.toString().trim(),
        };
        controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
      });

      proc.stderr.on("data", (data: Buffer) => {
        const log = {
          timestamp: new Date().toISOString(),
          message: data.toString().trim(),
        };
        controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
      });

      proc.on("close", () => {
        controller.close();
      });

      const cancel = () => proc.kill();
      req.signal.addEventListener("abort", cancel);
    },
  });

  return new Response(stream, { headers });
}
