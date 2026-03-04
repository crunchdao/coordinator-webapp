import { Metadata } from "next";
import { CreateCheckpoint } from "@/modules/checkpoint/ui/createCheckpoint";

export const metadata: Metadata = {
  title: "Create Checkpoint",
};

export default function CheckpointPage() {
  return (
    <section className="p-6 space-y-3">
      <CreateCheckpoint />
    </section>
  );
}
