import hubApiClient from "@/utils/api/hubApiClient";
import {
  OverviewSliceItemResponse,
  OverviewSlicesListResponse,
  CreateOverviewSliceBody,
  UpdateOverviewSliceBody,
  Locale,
} from "../domain/types";
import { overviewEndpoints } from "./endpoints";

export const getOverviewSlices = async (
  crunchName: string,
  locale?: Locale
): Promise<OverviewSlicesListResponse> => {
  const response = await hubApiClient.get(overviewEndpoints.slices(crunchName), {
    params: { locale },
  });
  return response.data;
};

export const createOverviewSlice = async (
  crunchName: string,
  body: CreateOverviewSliceBody,
  locale?: Locale
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.post(
    overviewEndpoints.slices(crunchName),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const updateOverviewSlice = async (
  crunchName: string,
  sliceName: string,
  body: UpdateOverviewSliceBody,
  locale?: Locale
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.patch(
    overviewEndpoints.slice(crunchName, sliceName),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const deleteOverviewSlice = async (
  crunchName: string,
  sliceName: string,
  locale?: Locale
): Promise<void> => {
  await hubApiClient.delete(overviewEndpoints.slice(crunchName, sliceName), {
    params: { locale },
  });
};
