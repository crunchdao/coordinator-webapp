import cpiApiClient from "@/utils/api/cpiApiClient";
import { coordinatorEndpoints } from "./endpoints";
import { CoordinatorCpi, GetCoordinatorsParams } from "../domain/types";

export const getCoordinators = async (
  params?: GetCoordinatorsParams
): Promise<CoordinatorCpi[]> => {
  const response = await cpiApiClient.get(coordinatorEndpoints.getCoordinators(), {
    params: {
      owner: params?.owner,
    },
  });
  return response.data;
};
