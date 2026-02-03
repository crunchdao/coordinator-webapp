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

interface DeleteColumnButtonProps {
  columnId: number;
  columnName?: string;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const DeleteColumnButton: React.FC<DeleteColumnButtonProps> = ({
  columnId,
  columnName,
  onDelete,
  loading = false,
}) => {
  const handleDelete = () => {
    onDelete(columnId);
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
            {columnName ? `the "${columnName}" column` : "this column"}?
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
