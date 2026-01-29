"use client";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@crunch-ui/core";
import { Plus } from "@crunch-ui/icons";
import { PitchFormData, PitchSliceType } from "../domain/types";

interface AddSliceDialogProps {
  form: UseFormReturn<PitchFormData>;
}

export function AddSliceDialog({ form }: AddSliceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "slices",
  });

  const handleAddSlice = (type: PitchSliceType) => {
    const defaultTitles = {
      [PitchSliceType.KEY_METRICS]: "Key Metrics",
      [PitchSliceType.CONTENT]: "Content",
      [PitchSliceType.ROADMAP]: "Roadmap",
      [PitchSliceType.TEAM]: "Team",
    };

    const baseSlice = {
      id: Date.now(),
      name: type.toLowerCase().replace("_", "-"),
      displayName: defaultTitles[type],
      order: fields.length,
    };

    switch (type) {
      case PitchSliceType.KEY_METRICS:
        append({
          ...baseSlice,
          type: PitchSliceType.KEY_METRICS,
          nativeConfiguration: { metrics: [] },
        });
        break;
      case PitchSliceType.CONTENT:
        append({
          ...baseSlice,
          type: PitchSliceType.CONTENT,
          nativeConfiguration: { markdown: "" },
        });
        break;
      case PitchSliceType.ROADMAP:
        append({
          ...baseSlice,
          type: PitchSliceType.ROADMAP,
          nativeConfiguration: { events: [] },
        });
        break;
      case PitchSliceType.TEAM:
        append({
          ...baseSlice,
          type: PitchSliceType.TEAM,
          nativeConfiguration: { members: [] },
        });
        break;
    }
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Add Slice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Content Slice</DialogTitle>
          <DialogDescription>
            Choose the type of content you want to add to your pitch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => handleAddSlice(PitchSliceType.KEY_METRICS)}
          >
            Key Metrics
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddSlice(PitchSliceType.CONTENT)}
          >
            Content
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddSlice(PitchSliceType.ROADMAP)}
          >
            Roadmap
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddSlice(PitchSliceType.TEAM)}
          >
            Team
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
