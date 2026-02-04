"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@crunch-ui/core";
import { Copy, Check } from "@crunch-ui/icons";

const SWITCH_COMMANDS = ["make down", "make deploy-platform"];

export const SwitchToPlatformDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SWITCH_COMMANDS.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="primary">
          Deploy my Crunch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ready to deploy your Crunch?</DialogTitle>
          <DialogDescription>
            Switch to the full Platform to register as a coordinator, stake,
            and publish your Crunch to the hub.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">You just have to run:</p>
          <div className="flex items-start gap-2 relative">
            <pre className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-sm">
              {SWITCH_COMMANDS.map((cmd, i) => (
                <div key={i}>{cmd}</div>
              ))}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
