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
import { useRemoveWidget } from "../application/hooks/useRemoveWidget";

interface DeleteWidgetButtonProps {
  widgetId: number;
  widgetName?: string;
}

export const DeleteWidgetButton: React.FC<DeleteWidgetButtonProps> = ({
  widgetId,
  widgetName,
}) => {
  const { removeWidget, removeWidgetLoading } = useRemoveWidget();

  const handleDelete = () => {
    removeWidget(widgetId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          disabled={removeWidgetLoading}
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
