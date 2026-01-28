import { ReactNode } from "react";
import { PendingStatusBanner } from "@coordinator/auth/src/ui/pendingStatusBanner";
import { ReadOnlyWrapper } from "@coordinator/auth/src/ui/readOnlyWrapper";

export default function ApprovedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PendingStatusBanner />
      <ReadOnlyWrapper>{children}</ReadOnlyWrapper>
    </>
  );
}
