import Image from "next/image";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import { WalletConnection } from "@/modules/wallet/ui/walletConnection";
import { NavbarBreadcrumb } from "./navbarBreadcrumb";

export const TopNavbar: React.FC = () => {
  return (
    <nav className="w-full py-3 border-b bg-card">
      <div className="container mx-auto flex items-center gap-3">
        <Link href={INTERNAL_LINKS.ROOT}>
          <Image
            priority
            src="/images/crunch.svg"
            alt="Crunch Lab logo"
            width={20}
            height={14}
          />
        </Link>
        <NavbarBreadcrumb />
        <div className="ml-auto">
          <WalletConnection />
        </div>
      </div>
    </nav>
  );
};
