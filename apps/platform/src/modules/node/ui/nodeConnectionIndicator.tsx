"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { useNodeConnection } from "../application/context/nodeConnectionContext";
import { useNodeStatus } from "../application/hooks/useNodeStatus";

export function NodeConnectionIndicator() {
  const { nodeUrl, setNodeUrl, isDefault } = useNodeConnection();
  const { nodeStatus } = useNodeStatus();
  const [editUrl, setEditUrl] = useState(nodeUrl);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setNodeUrl(editUrl);
    setOpen(false);
  };

  const handleReset = () => {
    setEditUrl("http://localhost:8000");
    setNodeUrl("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <span
                className={`h-2 w-2 rounded-full ${
                  nodeStatus.isOnline ? "bg-green-500" : "bg-red-500"
                }`}
              />
              Node
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="flex flex-col gap-1">
            <span>
              <span className="text-muted-foreground">Status:</span>{" "}
              {nodeStatus.isOnline ? "Online" : "Offline"}
            </span>
            <span>
              <span className="text-muted-foreground">URL:</span> {nodeUrl}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Node Connection</h4>
            <p className="text-xs text-muted-foreground">
              Configure which coordinator node to connect to.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={nodeStatus.isOnline ? "success" : "destructive"}
              size="sm"
            >
              {nodeStatus.isOnline ? "Online" : "Offline"}
            </Badge>
            {isDefault && (
              <Badge variant="outline" size="sm">
                Default
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Node URL</label>
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="font-mono text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              Connect
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
