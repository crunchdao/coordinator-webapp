import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import cpiApiClient, {
  getCpiClientForNetwork,
} from "@/utils/api/cpiApiClient";
import { Crunch } from "@/modules/crunch/domain/types";
import { ModelState, GetModelStatesOptions } from "../domain/types";
import { endpoints } from "./endpoints";

export const getCrunchByAddress = async (
  address: string,
  network: WalletAdapterNetwork
): Promise<Crunch> => {
  const client = getCpiClientForNetwork(network);
  const response = await client.get(endpoints.getCrunch(address));
  return response.data;
};

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
