"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from "@crunch-ui/core";
import { Edit } from "@crunch-ui/icons";
import { AddColumnForm } from "./addColumnForm";
import { useState } from "react";
import { LeaderboardColumn } from "../domain/types";

interface EditColumnSheetProps {
  column: LeaderboardColumn;
}

export const EditColumnSheet: React.FC<EditColumnSheetProps> = ({ column }) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon-sm">
          <Edit className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Edit Column</SheetTitle>
          <SheetDescription>
            Update the configuration for "
            {column.display_name || column.property}"
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <AddColumnForm onSuccess={() => setOpen(false)} editValues={column} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
