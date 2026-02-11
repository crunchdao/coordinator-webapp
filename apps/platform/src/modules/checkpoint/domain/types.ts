export interface CheckpointPrize {
  prize: number;
  cruncher: string;
  claimed: boolean;
}

export type CheckpointStatus = "LoadingPrizes" | "LoadedPrizes" | "FullyClaimed";

export interface Checkpoint {
  address: string;
  status: CheckpointStatus;
  crunch: string;
  coordinator: string;
  index: number;
  prizes: CheckpointPrize[];
}

export interface GetCheckpointsParams {
  crunchNames?: string[];
  status?: CheckpointStatus;
}
