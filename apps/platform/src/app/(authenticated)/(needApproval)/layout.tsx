import { ReactNode } from "react";
import { PendingStatusBanner } from "@/modules/coordinator/ui/pendingStatusBanner";
import { ReadOnlyWrapper } from "@/modules/coordinator/ui/readOnlyWrapper";

export default function ApprovedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PendingStatusBanner />
      <ReadOnlyWrapper>{children}</ReadOnlyWrapper>
    </>
  );
}
