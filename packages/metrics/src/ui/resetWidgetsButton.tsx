"use client";
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@crunch-ui/core";
import { Refresh } from "@crunch-ui/icons";
import { useResetWidgets } from "../application/hooks/useResetWidgets";

export const ResetWidgetsButton: React.FC = () => {
  const { resetWidgets, resetWidgetsLoading } = useResetWidgets();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={resetWidgetsLoading}>
          <Refresh className="w-4 h-4" />
          Reset to Default
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset metrics to default?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all your widgets and restore the default
            configuration. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => resetWidgets()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Reset Widgets
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
