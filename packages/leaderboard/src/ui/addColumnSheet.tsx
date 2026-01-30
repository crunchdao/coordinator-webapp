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
import { Plus } from "@crunch-ui/icons";
import { AddColumnForm } from "./addColumnForm";
import { useState } from "react";
import { LeaderboardColumn } from "../domain/types";

interface AddColumnSheetProps {
  onAdd: (column: Omit<LeaderboardColumn, "id">) => void;
  onUpdate: (id: number, column: Omit<LeaderboardColumn, "id">) => void;
  addLoading?: boolean;
  updateLoading?: boolean;
}

export const AddColumnSheet: React.FC<AddColumnSheetProps> = ({
  onAdd,
  onUpdate,
  addLoading,
  updateLoading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="primary">
          <Plus />
          Add Column
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Add New Column</SheetTitle>
          <SheetDescription>
            Configure a new column for your leaderboard
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <AddColumnForm
            onSuccess={() => setOpen(false)}
            onAdd={onAdd}
            onUpdate={onUpdate}
            addLoading={addLoading}
            updateLoading={updateLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
