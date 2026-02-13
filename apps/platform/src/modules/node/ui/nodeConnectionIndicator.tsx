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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { Settings } from "@crunch-ui/icons";
import { useNodeConnection } from "../application/context/nodeConnectionContext";
import { useNodeStatus } from "../application/hooks/useNodeStatus";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

type ConnectionState = "online" | "mismatch" | "offline";

export function NodeConnectionIndicator() {
  const { nodeUrl, setNodeUrl, isDefault } = useNodeConnection();
  const { nodeStatus } = useNodeStatus();
  const { crunchData } = useCrunchContext();
  const [open, setOpen] = useState(false);
  const [editUrl, setEditUrl] = useState(nodeUrl);

  // Determine connection state
  const addressMismatch =
    nodeStatus.isOnline &&
    nodeStatus.info?.crunch_address &&
    crunchData?.address &&
    nodeStatus.info.crunch_address !== crunchData.address;

  const connectionState: ConnectionState = !nodeStatus.isOnline
    ? "offline"
    : addressMismatch
      ? "mismatch"
      : "online";

  const dotColor = {
    online: "bg-green-500",
    mismatch: "bg-yellow-500",
    offline: "bg-red-500",
  }[connectionState];

  const nodeLabel = nodeStatus.info?.crunch_id
    ? `Node: ${nodeStatus.info.crunch_id}`
    : "Crunch Node";

  const tooltipText =
    connectionState === "mismatch"
      ? `Address mismatch!\nNode: ${nodeStatus.info?.crunch_address}\nCrunch: ${crunchData?.address}`
      : connectionState === "online"
        ? `Connected to ${nodeUrl}`
        : "Node offline";

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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpen}
            className="gap-1.5"
          >
            <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
            <Settings className="h-3.5 w-3.5" />
            <span className="text-xs">{nodeLabel}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs whitespace-pre-line">
          {tooltipText}
        </TooltipContent>
      </Tooltip>

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
                variant={
                  connectionState === "online"
                    ? "success"
                    : connectionState === "mismatch"
                      ? "warning"
                      : "destructive"
                }
                size="sm"
              >
                {connectionState === "online"
                  ? "Online"
                  : connectionState === "mismatch"
                    ? "Address Mismatch"
                    : "Offline"}
              </Badge>
              {isDefault && (
                <Badge variant="outline" size="sm">
                  Default
                </Badge>
              )}
            </div>

            {nodeStatus.isOnline && nodeStatus.info && (
              <div className="rounded-md border p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crunch ID</span>
                  <span className="font-medium">
                    {nodeStatus.info.crunch_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">
                    {nodeStatus.info.network}
                  </span>
                </div>
                {nodeStatus.info.crunch_address && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">
                      Node Address
                    </span>
                    <span className="font-mono text-xs truncate">
                      {nodeStatus.info.crunch_address}
                    </span>
                  </div>
                )}
                {crunchData?.address && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground shrink-0">
                      Crunch Address
                    </span>
                    <span className="font-mono text-xs truncate">
                      {crunchData.address}
                    </span>
                  </div>
                )}
                {addressMismatch && (
                  <p className="text-xs text-yellow-600">
                    ⚠ The node&apos;s crunch address does not match this
                    crunch&apos;s on-chain address. Make sure you&apos;re
                    connected to the right node.
                  </p>
                )}
              </div>
            )}

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
