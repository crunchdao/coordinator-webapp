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
  crunchAddress: string,
  locale?: Locale
): Promise<OverviewSlicesListResponse> => {
  const response = await hubApiClient.get(overviewEndpoints.slices(crunchAddress), {
    params: { locale },
  });
  return response.data;
};

export const createOverviewSlice = async (
  crunchAddress: string,
  body: CreateOverviewSliceBody,
  locale?: Locale
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.post(
    overviewEndpoints.slices(crunchAddress),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const updateOverviewSlice = async (
  crunchAddress: string,
  sliceName: string,
  body: UpdateOverviewSliceBody,
  locale?: Locale
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.patch(
    overviewEndpoints.slice(crunchAddress, sliceName),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const deleteOverviewSlice = async (
  crunchAddress: string,
  sliceName: string,
  locale?: Locale
): Promise<void> => {
  await hubApiClient.delete(overviewEndpoints.slice(crunchAddress, sliceName), {
    params: { locale },
  });
};
