import { Metadata } from "next";
import { BackfillManager } from "@/modules/backfill/ui/backfillManager";

export const metadata: Metadata = {
  title: "Backfill",
  description: "Export historical feed data to Parquet files",
};

export default function BackfillPage() {
  return <BackfillManager />;
}
