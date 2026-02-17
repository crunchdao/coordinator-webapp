"use client";

import { useParams } from "next/navigation";
import { StrategyDetail } from "@/modules/strategy/ui/strategyDetail";

export default function StrategyDetailPage() {
  const params = useParams();
  const name = params.name as string;

  return <StrategyDetail name={name} />;
}
