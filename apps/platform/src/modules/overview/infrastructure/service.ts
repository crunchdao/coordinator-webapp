import hubApiClient from "@/utils/api/hubApiClient";
import { Locale } from "@/modules/common/types";
import {
  OverviewSliceItemResponse,
  OverviewSlicesListResponse,
  CreateOverviewSliceBody,
  UpdateOverviewSliceBody,
} from "../domain/types";
import { overviewEndpoints } from "./endpoints";

export const getOverviewSlices = async (
  competitionIdentifier: string,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<OverviewSlicesListResponse> => {
  const response = await hubApiClient.get(
    overviewEndpoints.slices(competitionIdentifier),
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const createOverviewSlice = async (
  competitionIdentifier: string,
  body: CreateOverviewSliceBody,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.post(
    overviewEndpoints.slices(competitionIdentifier),
    body,
    { params: { locale }, ...(hubBaseUrl && { baseURL: hubBaseUrl }) }
  );
  return response.data;
};

export const updateOverviewSlice = async (
  competitionIdentifier: string,
  sliceName: string,
  body: UpdateOverviewSliceBody,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<OverviewSliceItemResponse> => {
  const response = await hubApiClient.patch(
    overviewEndpoints.slice(competitionIdentifier, sliceName),
    body,
    { params: { locale }, ...(hubBaseUrl && { baseURL: hubBaseUrl }) }
  );
  return response.data;
};

export const deleteOverviewSlice = async (
  competitionIdentifier: string,
  sliceName: string,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<void> => {
  await hubApiClient.delete(
    overviewEndpoints.slice(competitionIdentifier, sliceName),
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
};
