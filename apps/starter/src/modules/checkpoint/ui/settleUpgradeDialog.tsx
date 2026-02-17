"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from "@crunch-ui/core";
import { Copy, Check } from "@crunch-ui/icons";

const SWITCH_COMMAND = "make platform";

interface SettleUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettleUpgradeDialog({ open, onOpenChange }: SettleUpgradeDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SWITCH_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>On-Chain Features</DialogTitle>
          <DialogDescription>
            Settling checkpoints on-chain requires the Platform edition. Switch
            to Platform mode to enable wallet integration, on-chain settlement,
            and prize distribution.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            To switch to the Platform app, run:
          </p>
          <div className="flex items-start gap-2 relative">
            <pre className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-sm">
              {SWITCH_COMMAND}
            </pre>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleCopy}
              className="absolute top-1 right-1"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
