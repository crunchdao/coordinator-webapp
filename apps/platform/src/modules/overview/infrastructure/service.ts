import hubApiClient from "@/utils/api/hubApiClient";
import { hubRequestConfig } from "@/utils/api/hubRequestConfig";
import type { Environment } from "@/config";
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
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<OverviewSlicesListResponse> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.get(
    overviewEndpoints.slices(competitionIdentifier),
    config
  );
  return response.data;
};

export const createOverviewSlice = async (
  competitionIdentifier: string,
  body: CreateOverviewSliceBody,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<OverviewSliceItemResponse> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.post(
    overviewEndpoints.slices(competitionIdentifier),
    body,
    config
  );
  return response.data;
};

export const updateOverviewSlice = async (
  competitionIdentifier: string,
  sliceName: string,
  body: UpdateOverviewSliceBody,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<OverviewSliceItemResponse> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.patch(
    overviewEndpoints.slice(competitionIdentifier, sliceName),
    body,
    config
  );
  return response.data;
};

export const deleteOverviewSlice = async (
  competitionIdentifier: string,
  sliceName: string,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<void> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  await hubApiClient.delete(
    overviewEndpoints.slice(competitionIdentifier, sliceName),
    config
  );
};
