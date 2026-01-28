"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
} from "@crunch-ui/core";
import { useStartCrunch } from "../application/hooks/useStartCrunch";
import LoadingOverlay from "@/ui/loading-overlay";

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
  const { startCrunch, startCrunchLoading } = useStartCrunch();

  const handleStart = () => {
    startCrunch(
      { crunchName },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {startCrunchLoading && (
          <LoadingOverlay
            title="Starting Crunch"
            subtitle="Processing your transaction..."
          />
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>Start Crunch</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Are you sure you want to start "{crunchName}"? Once started,
                crunchers will be able to register and participate.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground">Current Status:</span>
                <Badge variant="secondary">{currentState}</Badge>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={startCrunchLoading}>
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleStart}
            disabled={startCrunchLoading}
            loading={startCrunchLoading}
          >
            Start Crunch
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
