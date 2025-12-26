import { ReactNode } from "react";
import { AuthWrapper } from "@/modules/auth/ui/authWrapper";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthWrapper>{children}</AuthWrapper>;
}