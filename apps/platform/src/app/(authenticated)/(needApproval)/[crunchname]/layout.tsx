import { RestrictedWrapper } from "@/modules/auth/ui/restrictedWrapper";
import { BasicNavbar } from "@/ui/navigation/basicNavbar";

export default function CrunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RestrictedWrapper showDefaultMessage={false}>
        <BasicNavbar />
      </RestrictedWrapper>
      <div className="p-6">{children}</div>
    </>
  );
}
