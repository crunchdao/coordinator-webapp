import { Metadata } from "next";
import { FeedMonitor } from "@/modules/feed/ui/feedMonitor";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Feeds",
  description: "Observe feed indexing health and recent market records",
};

export default function FeedsPage() {
  return <FeedMonitor />;
}
