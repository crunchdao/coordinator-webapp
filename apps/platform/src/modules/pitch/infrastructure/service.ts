import hubApiClient from "@/utils/api/hubApiClient";
import { hubRequestConfig } from "@/utils/api/hubRequestConfig";
import type { Environment } from "@/config";
import { PaginatedResponse } from "@/modules/common/domain/pagination";
import { Locale } from "@/modules/common/types";
import {
  Pitch,
  PitchSlicesListResponse,
  PitchSlice,
  CreatePitchSliceBody,
  UpdatePitchSliceBody,
} from "../domain/types";
import { pitchEndpoints } from "./endpoints";

export const getPitches = async (
  seasonNumber: number,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<PaginatedResponse<Pitch>> => {
  const config =
    hubBaseUrl && hubEnv ? hubRequestConfig(hubBaseUrl, hubEnv) : {};
  const response = await hubApiClient.get(
    pitchEndpoints.pitches(seasonNumber),
    config
  );
  return response.data;
};

export const getPitch = async (
  seasonNumber: number,
  pitchName: string,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<Pitch> => {
  const config =
    hubBaseUrl && hubEnv ? hubRequestConfig(hubBaseUrl, hubEnv) : {};
  const response = await hubApiClient.get(
    pitchEndpoints.pitch(seasonNumber, pitchName),
    config
  );
  return response.data;
};

export const getPitchSlices = async (
  seasonNumber: number,
  competitionIdentifier: string,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<PitchSlicesListResponse> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.get(
    pitchEndpoints.slices(seasonNumber, competitionIdentifier),
    config
  );
  return response.data;
};

export const createPitchSlice = async (
  seasonNumber: number,
  competitionIdentifier: string,
  body: CreatePitchSliceBody,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<PitchSlice> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.post(
    pitchEndpoints.slices(seasonNumber, competitionIdentifier),
    body,
    config
  );
  return response.data;
};

export const updatePitchSlice = async (
  seasonNumber: number,
  competitionIdentifier: string,
  sliceName: string,
  body: UpdatePitchSliceBody,
  locale?: Locale,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<PitchSlice> => {
  const config =
    hubBaseUrl && hubEnv
      ? hubRequestConfig(hubBaseUrl, hubEnv, { params: { locale } })
      : { params: { locale } };
  const response = await hubApiClient.patch(
    pitchEndpoints.slice(seasonNumber, competitionIdentifier, sliceName),
    body,
    config
  );
  return response.data;
};

export const deletePitchSlice = async (
  seasonNumber: number,
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
    pitchEndpoints.slice(seasonNumber, competitionIdentifier, sliceName),
    config
  );
};
