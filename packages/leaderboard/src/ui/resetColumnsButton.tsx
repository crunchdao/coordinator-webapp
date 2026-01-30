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

interface ResetColumnsButtonProps {
  onReset: () => void;
  loading?: boolean;
}

export const ResetColumnsButton: React.FC<ResetColumnsButtonProps> = ({
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
          <AlertDialogTitle>Reset columns to default?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all your custom columns and restore the default
            configuration. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onReset}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Reset columns
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
