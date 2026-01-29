"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
  SheetDescription,
} from "@crunch-ui/core";
import { Edit } from "@crunch-ui/icons";
import { UpdateModelForm } from "./updateModelForm";
import { Model } from "../domain/types";

interface UpdateModelSheetProps {
  model: Model;
}

export const UpdateModelSheet: React.FC<UpdateModelSheetProps> = ({
  model,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="primary" size="icon-sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Update Model</SheetTitle>
          <SheetDescription>
            Update a the model's name, description, and other details.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <UpdateModelForm model={model} onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
