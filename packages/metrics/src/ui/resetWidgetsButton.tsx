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

interface ResetWidgetsButtonProps {
  onReset: () => void;
  loading?: boolean;
}

export const ResetWidgetsButton: React.FC<ResetWidgetsButtonProps> = ({
  onReset,
  loading = false,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={loading}>
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
            onClick={onReset}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Reset Widgets
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
