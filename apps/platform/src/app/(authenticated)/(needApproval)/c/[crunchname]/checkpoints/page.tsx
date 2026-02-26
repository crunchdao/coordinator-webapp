import { Metadata } from "next";
import { CheckpointList } from "@/modules/checkpoint/ui/checkpointList";

export const metadata: Metadata = {
  title: "Checkpoints",
};

export default function CheckpointsPage() {
  return (
    <section className="p-6 space-y-3">
      <CheckpointList />
    </section>
  );
}
