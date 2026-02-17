export interface Strategy {
  name: string;
  model: string;
  trade_pair: string;
  miner_url: string;
  status: "connected" | "stale" | "offline";
  direction: string;
  leverage: number;
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  max_drawdown: number;
  last_signal_ts: number;
}

export interface StrategyDetail {
  name: string;
  model: string;
  trade_pair: string;
  status: string;
  direction: string;
  leverage: number;
  entry_price: number;
  total_trades: number;
  winning_trades: number;
  win_rate: number;
  total_pnl: number;
  peak_pnl: number;
  max_drawdown: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  avg_hold_seconds: number;
  trades_today: number;
  pnl_today: number;
  last_signal_ts: number;
  last_price: number;
}

export interface Trade {
  ts: number;
  closed_direction: string;
  entry_price: number;
  exit_price: number;
  leverage: number;
  return: number;
  pnl: number;
  cumulative_pnl: number;
  hold_seconds: number;
}

export interface Candle {
  ts: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
