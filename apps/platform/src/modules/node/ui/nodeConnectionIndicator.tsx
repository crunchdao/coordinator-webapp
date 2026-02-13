"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@crunch-ui/core";
import { Settings } from "@crunch-ui/icons";
import { useNodeConnection } from "../application/context/nodeConnectionContext";
import { useNodeStatus } from "../application/hooks/useNodeStatus";

export function NodeConnectionIndicator() {
  const { nodeUrl, setNodeUrl, isDefault } = useNodeConnection();
  const { nodeStatus } = useNodeStatus();
  const [open, setOpen] = useState(false);
  const [editUrl, setEditUrl] = useState(nodeUrl);

  const handleOpen = () => {
    setEditUrl(nodeUrl);
    setOpen(true);
  };

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
    <>
      <Button variant="outline" size="sm" onClick={handleOpen} className="gap-1.5">
        <span
          className={`h-2 w-2 rounded-full shrink-0 ${
            nodeStatus.isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <Settings className="h-3.5 w-3.5" />
        <span className="text-xs">Crunch Node</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crunch Node</DialogTitle>
            <DialogDescription>
              Configure which coordinator node this crunch connects to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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

            {nodeStatus.isOnline && (
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Models</p>
                  <p className="font-medium">{nodeStatus.models.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Feeds</p>
                  <p className="font-medium">{nodeStatus.feeds.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Checkpoints</p>
                  <p className="font-medium">
                    {nodeStatus.recentCheckpoints.length}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Node URL</label>
              <Input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
              <p className="text-xs text-muted-foreground">
                The URL of the coordinator node&apos;s report API.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset to Default
              </Button>
              <Button size="sm" onClick={handleSave}>
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
