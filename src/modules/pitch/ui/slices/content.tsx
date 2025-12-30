"use client";
import { MdPreview } from "@/ui/md-editor";
import z from "zod";
import { contentSliceSchema } from "../../application/schemas/pitch";

export const Content: React.FC<{
  slice: z.infer<typeof contentSliceSchema>;
}> = ({ slice }) => {
  const validationResult = contentSliceSchema.safeParse(slice);

  if (!validationResult.success) {
    console.error("Invalid content slice data:", validationResult.error);
    return null;
  }

  const validatedSlice = validationResult.data;

  return (
    <div className="w-full">
      {validatedSlice.displayName && (
        <h2 className="body font-medium mb-6">{validatedSlice.displayName}</h2>
      )}
      <MdPreview
        className="text-muted-foreground [&_h1,&_h2,&_h3]:text-card-foreground [&_h1]:body-lg [&_h2,&_h3]:body grid gap-3"
        value={validatedSlice.nativeConfiguration.markdown}
      />
    </div>
  );
};
