"use client";
import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@crunch-ui/core";
import { List, Settings } from "@crunch-ui/icons";
import { LogsDialog } from "../log/ui/logsDialog";

export const DevMenu = () => {
  const [logsOpen, setLogsOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-8 w-8 rounded-full [&_svg]:w-4"
            size="icon-sm"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" align="end" className="mb-2">
          <DropdownMenuItem onClick={() => setLogsOpen(true)}>
            <List className="mr-2 h-4 w-4" />
            System Logs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogsDialog open={logsOpen} onOpenChange={setLogsOpen} />
    </>
  );
};
