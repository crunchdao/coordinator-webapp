"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@crunch-ui/core";
import { Logs } from "./logs";

interface LogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogsDialog: React.FC<LogsDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[calc(100vw-32px)] !w-[90vw] max-h-[calc(100vh-32px)] flex flex-col">
        <DialogHeader>
          <DialogTitle>System Logs</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <Logs />
        </div>
      </DialogContent>
    </Dialog>
  );
};