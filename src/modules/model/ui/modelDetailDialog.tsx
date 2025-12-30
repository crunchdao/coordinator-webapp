"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@crunch-ui/core";
import { Code } from "@crunch-ui/icons";
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
        <Button variant="outline" size="sm">
          Raw <Code />
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
