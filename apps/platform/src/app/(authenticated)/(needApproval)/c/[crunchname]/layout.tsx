import { Metadata } from "next";
import { RestrictedWrapper } from "@/modules/coordinator/ui/restrictedWrapper";
import { BasicNavbar } from "@/ui/navigation/basicNavbar";
import { CrunchProvider } from "@/modules/crunch/application/context/crunchContext";
import { HubAuthProvider } from "@/modules/hub/application/context/hubAuthContext";

type Props = {
  params: Promise<{ crunchname: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { crunchname } = await params;

  return {
    title: {
      template: `%s - ${crunchname} - CrunchDAO`,
      default: `${crunchname} - CrunchDAO`,
    },
  };
}

export default function CrunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrunchProvider>
      <HubAuthProvider>
        <RestrictedWrapper showDefaultMessage={false}>
          <BasicNavbar />
        </RestrictedWrapper>
        <div className="space-y-3">{children}</div>
      </HubAuthProvider>
    </CrunchProvider>
  );
}
