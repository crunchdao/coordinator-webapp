"use client";
import {
  PitchSlice,
  contentSliceSchema,
  keyMetricsSliceSchema,
  roadmapSliceSchema,
  teamSliceSchema,
} from "../application/schemas/pitch";
import { Content } from "./slices/content";
import { KeyMetrics } from "./slices/keyMetrics";
import { Roadmap } from "./slices/roadmap";
import { Team } from "./slices/team";

export const SlicesRenderer: React.FC<{ slices: PitchSlice[] }> = ({
  slices,
}) => {
  const validSlices = slices?.filter((slice) => {
    switch (slice.type) {
      case "CONTENT":
        return contentSliceSchema.safeParse(slice).success;
      case "KEY_METRICS":
        return keyMetricsSliceSchema.safeParse(slice).success;
      case "ROADMAP":
        return roadmapSliceSchema.safeParse(slice).success;
      case "TEAM":
        return teamSliceSchema.safeParse(slice).success;
      default:
        return false;
    }
  });

  return (
    <div className="space-y-8">
      {validSlices
        ?.sort((a, b) => a.order - b.order)
        .map((slice) => {
          switch (slice.type) {
            case "CONTENT":
              return <Content slice={slice} key={slice.id} />;
            case "KEY_METRICS":
              return <KeyMetrics slice={slice} key={slice.id} />;
            case "ROADMAP":
              return <Roadmap slice={slice} key={slice.id} />;
            case "TEAM":
              return <Team slice={slice} key={slice.id} />;
            default:
              return null;
          }
        })}
    </div>
  );
};
