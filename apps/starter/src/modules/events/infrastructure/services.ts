import apiClient from "@coordinator/utils/src/api";
import { EventsOverviewResponse } from "../domain/types";
import { endpoints } from "./endpoints";

export const getEventsOverview = async (params?: {
  limit?: number;
  resolved_only?: boolean;
  pending_only?: boolean;
}): Promise<EventsOverviewResponse> => {
  const response = await apiClient.get(endpoints.getEventsOverview(params));
  return response.data;
};
