"use client";
import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@crunch-ui/core";
import { ArrowDown, ArrowUp, Plus, Trash } from "@crunch-ui/icons";
import { PitchFormData, PitchSliceType } from "../domain/types";
import { KeyMetricsSliceEditor } from "./slices/keyMetricsSliceEditor";
import { ContentSliceEditor } from "./slices/contentSliceEditor";
import { RoadmapSliceEditor } from "./slices/roadmapSliceEditor";
import { TeamSliceEditor } from "./slices/teamSliceEditor";

interface SliceManagerProps {
  form: UseFormReturn<PitchFormData>;
}

export function SliceManager({ form }: SliceManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "slices",
  });

  const handleAddSlice = (type: PitchSliceType) => {
    const baseSlice = {
      id: Date.now(),
      name: type.toLowerCase().replace("_", "-"),
      displayName: type.replace("_", " "),
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

  const renderSliceEditor = (sliceIndex: number) => {
    const slice = fields[sliceIndex];
    switch (slice.type) {
      case PitchSliceType.KEY_METRICS:
        return <KeyMetricsSliceEditor form={form} sliceIndex={sliceIndex} />;
      case PitchSliceType.CONTENT:
        return <ContentSliceEditor form={form} sliceIndex={sliceIndex} />;
      case PitchSliceType.ROADMAP:
        return <RoadmapSliceEditor form={form} sliceIndex={sliceIndex} />;
      case PitchSliceType.TEAM:
        return <TeamSliceEditor form={form} sliceIndex={sliceIndex} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <CardTitle>Content Slices</CardTitle>
      <div>
        <div className="flex items-center gap-2 mb-8">
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
        </div>

        <div className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="relative flex gap-3">
              <div className="flex-1 border-r pr-3">
                {renderSliceEditor(index)}
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  <ArrowUp />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  <ArrowDown />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => remove(index)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
