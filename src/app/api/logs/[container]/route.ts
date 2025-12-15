import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { checkApiEnvironment } from "@/utils/api-environment-check";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ container: string }> }
) {
  const envCheck = checkApiEnvironment();
  if (envCheck) return envCheck;
  
  const { container } = await params;

  const headers = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };

  const stream = new ReadableStream({
    start(controller) {
      const proc = spawn("docker", ["logs", "-f", container]);
      let closed = false;

      const closeStream = () => {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch (error) {
            // Controller already closed
          }
        }
      };

      proc.stdout.on("data", (data: Buffer) => {
        if (closed) return;
        try {
          const log = {
            timestamp: new Date().toISOString(),
            message: data.toString().trim(),
          };
          controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
        } catch (error) {
          // Controller already closed
        }
      });

      proc.stderr.on("data", (data: Buffer) => {
        if (closed) return;
        try {
          const log = {
            timestamp: new Date().toISOString(),
            message: data.toString().trim(),
          };
          controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
        } catch (error) {
          // Controller already closed
        }
      });

      proc.on("close", closeStream);
      proc.on("error", (error) => {
        console.error("Docker process error:", error);
        closeStream();
      });

      const cancel = () => {
        proc.kill();
        closeStream();
      };

      req.signal.addEventListener("abort", cancel);
    },
  });

  return new Response(stream, { headers });
}
