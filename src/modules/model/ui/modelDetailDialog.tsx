"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Badge,
} from "@crunch-ui/core";
import { Eye } from "@crunch-ui/icons";
import { Model } from "../domain/types";

interface ModelDetailDialogProps {
  model: Model;
}

export const ModelDetailDialog: React.FC<ModelDetailDialogProps> = ({
  model,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl max-w-full">
        <DialogHeader>
          <DialogTitle>Model Details</DialogTitle>
        </DialogHeader>
        <pre className="bg-muted p-4 rounded overflow-auto text-xs">
          {JSON.stringify(model, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
};
