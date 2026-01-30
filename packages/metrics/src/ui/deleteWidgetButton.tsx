"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@crunch-ui/core";
import { Trash } from "@crunch-ui/icons";

interface DeleteWidgetButtonProps {
  widgetId: number;
  widgetName?: string;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const DeleteWidgetButton: React.FC<DeleteWidgetButtonProps> = ({
  widgetId,
  widgetName,
  onDelete,
  loading = false,
}) => {
  const handleDelete = () => {
    onDelete(widgetId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          disabled={loading}
        >
          <Trash className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Column</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {widgetName ? `the "${widgetName}" widget` : "this widget"}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
