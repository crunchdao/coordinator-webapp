import React, { useRef, useEffect, useState } from "react";
import { cn } from "@crunch-ui/utils";
import { Badge, Button } from "@crunch-ui/core";
import { ChevronDown } from "@crunch-ui/icons";
import { AnsiText } from "@coordinator/dev/src/log/utils/ansiParser";

interface Log {
  id?: number | string;
  createdAt: string;
  emitter?: string;
  content: string;
  error?: boolean;
}

interface LogListProps {
  logs: Log[];
  logVariants?: Record<string, string>;
  autoscroll?: boolean;
  showTimestamp?: boolean;
}

const LogList: React.FC<LogListProps> = ({
  logs,
  logVariants,
  autoscroll = true,
  showTimestamp = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);

  const checkIfAtBottom = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      return isAtBottom;
    }
    return false;
  };

  useEffect(() => {
    if (autoscroll && logs.length > 0 && scrollRef.current) {
      if (!hasScrolledInitially || isUserAtBottom) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        // eslint-disable-next-line
        setHasScrolledInitially(true);
      }
    }
  }, [logs, autoscroll, hasScrolledInitially, isUserAtBottom]);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = checkIfAtBottom();
      setIsUserAtBottom(isAtBottom);
      setShowScrollButton(!isAtBottom);
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [logs]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex-1">
      <div ref={scrollRef} className="flex-1 max-h-[600px] overflow-auto">
        <div className="flex gap-4 h-full w-full relative">
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
                  {showTimestamp && (
                    <p
                      suppressHydrationWarning
                      className="body-xs text-muted-foreground w-16"
                    >
                      {new Date(line.createdAt).toLocaleTimeString()}
                    </p>
                  )}
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
                  <AnsiText text={line.content} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="outline"
          className="absolute bottom-4 right-4 shadow-lg"
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LogList;
