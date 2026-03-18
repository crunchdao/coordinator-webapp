import {
  Slice,
  SliceType,
  ContentNativeConfiguration,
  KeyMetricsNativeConfiguration,
  TimelineNativeConfiguration,
  TeamNativeConfiguration,
} from "@crunchdao/slices";

export type OverviewSlice = Slice & {
  updatedAt: string;
  createdAt: string;
};

export type OverviewSlicesListResponse = OverviewSlice[];
export type OverviewSliceItemResponse = OverviewSlice;

type SliceNativeConfiguration =
  | ContentNativeConfiguration
  | KeyMetricsNativeConfiguration
  | TimelineNativeConfiguration
  | TeamNativeConfiguration;

export interface CreateOverviewSliceBody {
  name: string;
  displayName?: string;
  type: SliceType;
  nativeConfiguration: SliceNativeConfiguration;
  order: number;
}

export interface UpdateOverviewSliceBody {
  name?: string;
  displayName?: string;
  type?: SliceType;
  nativeConfiguration?: SliceNativeConfiguration;
  order?: number;
}
