import axios from "axios";
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
  const response = await axios.get(overviewEndpoints.slices(crunchName), {
    params: { locale },
  });
  return response.data;
};

export const createOverviewSlice = async (
  crunchName: string,
  body: CreateOverviewSliceBody,
  locale?: Locale
): Promise<OverviewSliceItemResponse> => {
  const response = await axios.post(
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
  const response = await axios.patch(
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
  await axios.delete(overviewEndpoints.slice(crunchName, sliceName), {
    params: { locale },
  });
};
