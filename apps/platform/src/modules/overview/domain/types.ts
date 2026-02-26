import { Slice, SliceType } from "@crunchdao/slices";

export enum Locale {
  ENGLISH = "ENGLISH",
  CHINESE = "CHINESE",
}

export type OverviewSlice = Slice & {
  updatedAt: string;
  createdAt: string;
};

export type OverviewSlicesListResponse = OverviewSlice[];
export type OverviewSliceItemResponse = OverviewSlice;

export interface CreateOverviewSliceBody {
  name: string;
  displayName: string;
  type: SliceType;
  nativeConfiguration: Record<string, unknown>;
  order: number;
}

export interface UpdateOverviewSliceBody {
  name?: string;
  displayName?: string;
  type?: SliceType;
  nativeConfiguration?: Record<string, unknown>;
  order?: number;
}
