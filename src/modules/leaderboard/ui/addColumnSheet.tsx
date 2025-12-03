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

export const AddColumnSheet: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="primary">
          <Plus />
          Add Column
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Column</SheetTitle>
          <SheetDescription>
            Configure a new column for your leaderboard
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <AddColumnForm />
        </div>
      </SheetContent>
    </Sheet>
  );
};
