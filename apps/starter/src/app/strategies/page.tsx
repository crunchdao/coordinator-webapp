import { Metadata } from "next";
import { StrategyList } from "@/modules/strategy/ui/strategyList";

export const metadata: Metadata = {
  title: "Strategies",
  description: "Trading strategies overview",
};

export default function StrategiesPage() {
  return <StrategyList />;
}
