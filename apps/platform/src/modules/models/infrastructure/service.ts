import axios from "axios";
import { ModelState, GetModelStatesParams } from "../domain/types";
import { endpoints } from "./endpoints";

export const getModelStates = async (
  params?: GetModelStatesParams
): Promise<ModelState[]> => {
  const response = await axios.get(endpoints.getModelStates(), {
    params: {
      crunchNames: params?.crunchNames,
    },
  });
  return response.data;
};
