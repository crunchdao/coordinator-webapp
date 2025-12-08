import React, { useRef, useEffect } from "react";
import { cn } from "@crunch-ui/utils";
import { Badge } from "@crunch-ui/core";

interface Log {
  id?: number;
  createdAt: string;
  emitter?: string;
  content: string;
  error?: boolean;
}

interface LogListProps {
  logs: Log[];
  logVariants?: Record<string, string>;
  autoscroll: boolean;
}

const LogList: React.FC<LogListProps> = ({ logs, logVariants, autoscroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoscroll && logs && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoscroll, scrollRef]);

  return (
    <div className="flex-1 max-h-[600px] overflow-auto">
      <div
        ref={scrollRef}
        className="flex gap-4 h-full w-full relative overflow-y-scroll no-scrollbar"
      >
        <div className="flex flex-1 flex-col min-w-fit whitespace-pre">
          {logs.map((line, index) => (
            <div key={line.id} className="flex w-full flex-1 gap-x-2">
              <div
                className={cn(
                  "flex gap-4 py-px select-none",
                  index === 0 && "pt-4",
                  index === logs.length - 1 && "pb-4",
                  logVariants && "sm:min-w-40"
                )}
              >
                <p
                  suppressHydrationWarning
                  className="body-xs text-muted-foreground w-16"
                >
                  {new Date(line.createdAt).toLocaleTimeString()}
                </p>
                {logVariants && line.emitter && (
                  <Badge
                    size="sm"
                    variant={logVariants[line.emitter] as "primary"}
                    className="max-sm:hidden"
                  >
                    {line.emitter}
                  </Badge>
                )}
              </div>
              <p
                className={cn(
                  "text-xs !font-departure bg-background w-full min-h-[22px] pr-4 border-x border-border pl-3 py-1",
                  index === 0 && "border-t pt-4 mt-px rounded-t-md",
                  index === logs.length - 1 &&
                    "border-b pb-4 mb-px rounded-b-md",
                  line.error && "text-destructive"
                )}
              >
                {line.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogList;
