"use client";
import { useParams } from "next/navigation";
import { ModelLogsView } from "@/modules/model/ui/modelLogsView";

export default function ModelLogsPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <ModelLogsView jobId={jobId} />
    </div>
  );
}
