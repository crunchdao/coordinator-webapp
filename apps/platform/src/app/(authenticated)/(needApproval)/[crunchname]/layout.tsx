import { RestrictedWrapper } from "@/modules/auth/ui/restrictedWrapper";
import { BasicNavbar } from "@/ui/navigation/basicNavbar";
import { CrunchProvider } from "@/modules/crunch/application/context/crunchContext";
import { NodeConnectionProvider } from "@/modules/node/application/context/nodeConnectionContext";

export default function CrunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrunchProvider>
      <NodeConnectionProvider>
        <RestrictedWrapper showDefaultMessage={false}>
          <BasicNavbar />
        </RestrictedWrapper>
        <div className="space-y-3">{children}</div>
      </NodeConnectionProvider>
    </CrunchProvider>
  );
}
