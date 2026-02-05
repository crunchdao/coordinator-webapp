"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@crunch-ui/core";
import { StartCrunchForm } from "./startCrunchForm";

interface StartCrunchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crunchName: string;
  currentState: string;
}

export function StartCrunchDialog({
  open,
  onOpenChange,
  crunchName,
  currentState,
}: StartCrunchDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Start Crunch</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to start "{crunchName}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <StartCrunchForm
          crunchName={crunchName}
          currentState={currentState}
          onSuccess={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
