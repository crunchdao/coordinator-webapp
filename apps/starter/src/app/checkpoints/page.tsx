import { Metadata } from "next";
import { CheckpointList } from "@/modules/checkpoint/ui/checkpointList";

export const metadata: Metadata = {
  title: "Checkpoints",
  description: "View coordinator node checkpoint history and emission data",
};

export default function CheckpointsPage() {
  return <CheckpointList />;
}
