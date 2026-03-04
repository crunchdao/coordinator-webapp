export type NodeCheckpointStatus = "PENDING" | "SUBMITTED" | "CLAIMABLE" | "PAID";

export interface NodeCruncherReward {
  cruncher_index: number;
  reward_pct: number; // frac64: 1_000_000_000 = 100%
}

export interface NodeProviderReward {
  provider: string;
  reward_pct: number;
}

export interface NodeEmission {
  crunch: string;
  cruncher_rewards: NodeCruncherReward[];
  compute_provider_rewards: NodeProviderReward[];
  data_provider_rewards: NodeProviderReward[];
}

export interface NodeRankedEntry {
  model_id: string;
  model_name?: string;
  cruncher_name?: string;
  rank: number;
  prediction_count?: number;
  snapshot_count?: number;
  result_summary?: Record<string, number>;
}

export interface NodeCheckpoint {
  id: string;
  period_start: string;
  period_end: string;
  status: NodeCheckpointStatus;
  entries: NodeEmission[];
  meta: {
    snapshot_count?: number;
    model_count?: number;
    ranking?: NodeRankedEntry[];
  };
  created_at: string;
  tx_hash: string | null;
  submitted_at: string | null;
}
