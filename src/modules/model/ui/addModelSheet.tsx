"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from "@crunch-ui/core";
import { Plus } from "@crunch-ui/icons";
import { AddModelForm } from "./addModelForm";

export const AddModelSheet: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="primary" size="sm">
          <Plus className="mr-2" />
          Add Model
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Add New Model</SheetTitle>
          <SheetDescription>
            Add a new model to your configuration.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <AddModelForm onSuccess={handleSuccess} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
