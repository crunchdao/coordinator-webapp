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
import { useDeleteModel } from "../application/hooks/useDeleteModel";

interface DeleteModelButtonProps {
  modelId: string;
  modelName?: string;
}

export const DeleteModelButton: React.FC<DeleteModelButtonProps> = ({
  modelId,
  modelName,
}) => {
  const { deleteModel, deleteModelLoading } = useDeleteModel();

  const handleDelete = () => {
    deleteModel(modelId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          disabled={deleteModelLoading}
        >
          <Trash className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Model</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            {modelName ? `the "${modelName}" model` : "this model"}? This action
            cannot be undone.
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
