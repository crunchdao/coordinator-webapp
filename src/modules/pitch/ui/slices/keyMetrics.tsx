import React from "react";
import z from "zod";
import { keyMetricsSliceSchema } from "../../application/schemas/pitch";

interface KeyMetricsProps {
  slice: z.infer<typeof keyMetricsSliceSchema>;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ slice }) => {
  const validationResult = keyMetricsSliceSchema.safeParse(slice);

  if (!validationResult.success) {
    console.error("Invalid key metrics slice data:", validationResult.error);
    return null;
  }

  const validatedSlice = validationResult.data;
  const metrics = validatedSlice.nativeConfiguration.metrics;

  return (
    <div className="w-full">
      {validatedSlice.displayName && (
        <h2 className="body font-medium mb-6">{validatedSlice.displayName}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border-l border-primary pl-6">
            <h3 className="body-sm font-medium text-muted-foreground mb-2">
              {metric.displayName}
            </h3>
            <p className="body-lg text-card-foreground">
              {metric.displayValue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
