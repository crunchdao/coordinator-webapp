import axios from "axios";
import { Checkpoint, GetCheckpointsParams } from "../domain/types";
import { endpoints } from "./endpoints";

export const getCheckpoints = async (
  params?: GetCheckpointsParams
): Promise<Checkpoint[]> => {
  const response = await axios.get(endpoints.getCheckpoints(), {
    params: {
      crunchNames: params?.crunchNames,
      status: params?.status,
    },
  });
  return response.data;
};

export const getCheckpoint = async (address: string): Promise<Checkpoint> => {
  const response = await axios.get(endpoints.getCheckpoint(address));
  return response.data;
};
