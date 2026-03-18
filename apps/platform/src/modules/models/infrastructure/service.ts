import cpiApiClient, { getCpiClientForNetwork } from "@/utils/api/cpiApiClient";
import { ModelState, GetModelStatesOptions } from "../domain/types";
import { endpoints } from "./endpoints";

export const getModelStates = async (
  options?: GetModelStatesOptions
): Promise<ModelState[]> => {
  const client = options?.network
    ? getCpiClientForNetwork(options.network)
    : cpiApiClient;

  const response = await client.get(endpoints.getModelStates, {
    params: {
      crunchNames: options?.crunchNames,
    },
  });
  return response.data;
};
