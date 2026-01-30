"use client";
import { useState } from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@crunch-ui/core";
import { Edit } from "@crunch-ui/icons";
import { AddWidgetForm } from "./addWidgetForm";
import { Widget } from "../domain/types";

interface EditWidgetSheetProps {
  widget: Widget;
  widgets?: Widget[];
  onAdd: (widget: Omit<Widget, "id">) => void;
  onUpdate: (id: number, widget: Omit<Widget, "id">) => void;
  addLoading?: boolean;
  updateLoading?: boolean;
}

export const EditWidgetSheet: React.FC<EditWidgetSheetProps> = ({
  widget,
  widgets,
  onAdd,
  onUpdate,
  addLoading,
  updateLoading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon-sm">
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pb-8">
        <SheetHeader>
          <SheetTitle>Edit Widget</SheetTitle>
          <SheetDescription>
            Update the configuration for &ldquo;
            {widget.displayName}&ldquo;
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <AddWidgetForm
            editValues={widget}
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
