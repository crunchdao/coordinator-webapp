import Image from "next/image";
import Link from "next/link";
import { NavbarBreadcrumb } from "./navbarBreadcrumb";
import { EnvironmentBadge } from "@coordinator/settings/src/ui/environmentBadge";
import { INTERNAL_LINKS } from "@/utils/routes";

export const TopNavbar: React.FC = () => {
  return (
    <>
      <nav className="w-full py-4 px-6 bg-card flex items-center gap-3">
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
        <EnvironmentBadge />
      </nav>
      <div className="bg-border/30 min-h-px w-full" />
    </>
  );
};
