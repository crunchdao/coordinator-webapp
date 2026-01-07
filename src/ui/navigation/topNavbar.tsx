import Image from "next/image";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import { EnvironmentBadge } from "@/modules/settings/ui/environmentBadge";
import { WalletConnection } from "@/modules/wallet/ui/walletConnection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@crunch-ui/core";

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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground">Test</BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground">Test</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <WalletConnection />
        </div>
      </div>
    </nav>
  );
};
