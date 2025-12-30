import React from "react";
import z from "zod";
import { format } from "date-fns";
import { MdPreview } from "@/ui/md-editor";
import { roadmapSliceSchema } from "../../application/schemas/pitch";

interface IRoadmapProps {
  slice: z.infer<typeof roadmapSliceSchema>;
}

export const Roadmap: React.FC<IRoadmapProps> = ({ slice }) => {
  const validationResult = roadmapSliceSchema.safeParse(slice);

  if (!validationResult.success) {
    console.error("Invalid roadmap slice data:", validationResult.error);
    return null;
  }

  const validatedSlice = validationResult.data;
  const events = validatedSlice.nativeConfiguration.events;

  return (
    <div className="w-full">
      {validatedSlice.displayName && (
        <h2 className="body font-medium mb-6">{validatedSlice.displayName}</h2>
      )}
      <div>
        {events.map((event, index) => (
          <div
            key={index}
            className="flex gap-4 text-muted-foreground relative"
          >
            {index + 1 < events?.length && (
              <div className="border border-primary h-full w-px left-[82px] absolute top-1.5" />
            )}
            <div className="flex items-start gap-4">
              <p className="w-16 label-sm mt-0.5">
                {format(new Date(event.date), "MM yyyy")}
              </p>
              <div className="z-10 rounded-full mt-2 w-1.5 h-1.5 bg-primary ring-2 ring-orange-950" />
            </div>
            <MdPreview className="mb-4" value={event.markdown} />
          </div>
        ))}
      </div>
    </div>
  );
};
