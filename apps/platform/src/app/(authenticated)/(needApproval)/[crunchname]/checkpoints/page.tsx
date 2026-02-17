"use client";

import { CheckpointList } from "@/modules/checkpoint/ui/checkpointList";
import { PendingNodeCheckpoints } from "@/modules/checkpoint/ui/pendingNodeCheckpoints";

export default function CheckpointsPage() {
  return (
    <section className="p-6 space-y-3">
      <PendingNodeCheckpoints />
      <CheckpointList />
    </section>
  );
}
