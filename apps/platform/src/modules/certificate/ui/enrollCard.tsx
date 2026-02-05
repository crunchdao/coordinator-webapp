"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@crunch-ui/core";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { useCertificateEnrollmentStatus } from "../application/hooks/useCertificateEnrollmentStatus";
import { EnrollForm } from "./enrollForm";

export function EnrollCard() {
  const { connected } = useWallet();
  const { enrollmentStatus, enrollmentStatusLoading } =
    useCertificateEnrollmentStatus();

  const isEnrolled = enrollmentStatus?.enrolled === true;
  const isStale = isEnrolled && !enrollmentStatus.hotkeyMatch;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Certificate Enrollment</CardTitle>
            <CardDescription>
              Generate and sign a TLS certificate for your coordinator node
            </CardDescription>
          </div>
          {connected && !enrollmentStatusLoading && (
            <Badge
              variant={
                isEnrolled ? (isStale ? "destructive" : "success") : "secondary"
              }
            >
              {isEnrolled
                ? isStale
                  ? "Stale — Re-enroll Required"
                  : "Enrolled"
                : "Not Enrolled"}
            </Badge>
          )}
          {connected && enrollmentStatusLoading && (
            <Skeleton className="h-6 w-20" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <EnrollForm />
      </CardContent>
    </Card>
  );
}
