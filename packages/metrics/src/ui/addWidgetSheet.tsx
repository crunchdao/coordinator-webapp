"use client";
import { useState } from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@crunch-ui/core";
import { Plus } from "@crunch-ui/icons";
import { AddWidgetForm } from "./addWidgetForm";
import { Widget } from "../domain/types";

interface AddWidgetSheetProps {
  widgets?: Widget[];
  onAdd: (widget: Omit<Widget, "id">) => void;
  onUpdate: (id: number, widget: Omit<Widget, "id">) => void;
  addLoading?: boolean;
  updateLoading?: boolean;
}

export const AddWidgetSheet: React.FC<AddWidgetSheetProps> = ({
  widgets,
  onAdd,
  onUpdate,
  addLoading,
  updateLoading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Add Widget
      </Button>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Add Widget</SheetTitle>
          <SheetDescription>
            Configure a new widget for your metrics dashboard
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <AddWidgetForm
            onSubmit={() => setOpen(false)}
            widgets={widgets}
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
