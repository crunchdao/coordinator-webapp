import { ReactNode } from "react";
import { PendingStatusBanner } from "@/modules/auth/ui/pendingStatusBanner";
import { ReadOnlyWrapper } from "@/modules/auth/ui/readOnlyWrapper";

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
