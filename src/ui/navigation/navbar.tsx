import { RestrictedWrapper } from "@/modules/auth/ui/restrictedWrapper";
import { BasicNavbar } from "./basicNavbar";
import { TopNavbar } from "./topNavbar";

export const Navbar: React.FC = () => {
  return (
    <>
      <TopNavbar />
      <RestrictedWrapper showDefaultMessage={false}>
        <BasicNavbar />
      </RestrictedWrapper>
    </>
  );
};
