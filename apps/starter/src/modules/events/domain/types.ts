export interface ModelPrediction {
  model_id: string;
  model_name: string;
  prediction: number | null;
  brier_score: number | null;
  scored: boolean;
}

export interface EventOverview {
  event_id: string;
  title: string;
  description: string;
  source: string;
  cutoff: string;
  yes_price: number | null;
  outcome: number | null; // 0=No, 1=Yes, null=unresolved
  resolved: boolean;
  performed_at: string | null;
  predictions: ModelPrediction[];
}

export interface EventsOverviewResponse {
  events: EventOverview[];
  total: number;
  resolved_count: number;
  pending_count: number;
}
