"use client";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { ArrowDown, ArrowUp, Trash } from "@crunch-ui/icons";
import { PitchFormData, PitchSliceType } from "../domain/types";
import { KeyMetricsSliceEditor } from "./slices/keyMetricsSliceEditor";
import { ContentSliceEditor } from "./slices/contentSliceEditor";
import { RoadmapSliceEditor } from "./slices/roadmapSliceEditor";
import { TeamSliceEditor } from "./slices/teamSliceEditor";

interface SliceManagerProps {
  form: UseFormReturn<PitchFormData>;
}

export function SliceManager({ form }: SliceManagerProps) {
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
      <Card>
        <CardHeader>
          <CardTitle>Content Slices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-8">
            <Select onValueChange={handleAddSlice}>
              <SelectTrigger>
                <SelectValue placeholder="Add a new slice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PitchSliceType.KEY_METRICS}>
                  Key Metrics
                </SelectItem>
                <SelectItem value={PitchSliceType.CONTENT}>Content</SelectItem>
                <SelectItem value={PitchSliceType.ROADMAP}>Roadmap</SelectItem>
                <SelectItem value={PitchSliceType.TEAM}>Team</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              disabled={!fields.length}
              onClick={() =>
                console.log("Save all slices:", form.getValues("slices"))
              }
            >
              Save All Slices
            </Button>
          </div>

          <div className="space-y-8">
            {fields.map((field, index) => (
              <div key={field.id} className="relative flex gap-3">
                <div className="flex-1">{renderSliceEditor(index)}</div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => remove(index)}
                  >
                    <Trash />
                  </Button>
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
