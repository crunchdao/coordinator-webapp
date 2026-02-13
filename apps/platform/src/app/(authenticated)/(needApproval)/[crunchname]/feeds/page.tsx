"use client";

import { FeedMonitor } from "@/modules/node/ui/feedMonitor";

export default function FeedsPage() {
  return (
    <section className="p-6 space-y-3">
      <FeedMonitor />
    </section>
  );
}
