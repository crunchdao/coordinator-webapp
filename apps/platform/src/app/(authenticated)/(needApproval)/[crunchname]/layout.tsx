import { RestrictedWrapper } from "@/modules/auth/ui/restrictedWrapper";
import { BasicNavbar } from "@/ui/navigation/basicNavbar";
import { CrunchProvider } from "@/modules/crunch/application/context/crunchContext";

export default function CrunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrunchProvider>
      <RestrictedWrapper showDefaultMessage={false}>
        <BasicNavbar />
      </RestrictedWrapper>
      <div className="space-y-3">{children}</div>
    </CrunchProvider>
  );
}
