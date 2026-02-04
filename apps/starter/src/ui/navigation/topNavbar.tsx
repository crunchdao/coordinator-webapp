import Image from "next/image";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/utils/routes";
import { NavigationItems } from "./navigationItems";
import { Badge } from "@crunch-ui/core";
import { SwitchToPlatformDialog } from "@/modules/settings/ui/switchToPlatformDialog";

export const TopNavbar: React.FC = () => {
  return (
    <>
      <nav className="bg-card flex justify-between items-center gap-3 sticky top-0 left-0 right-0 py-4 px-6 z-40 w-full backdrop-blur-sm border-b">
        <div className="flex items-center gap-3">
          <Link href={INTERNAL_LINKS.ROOT}>
            <Image
              priority
              src="/images/crunch.svg"
              alt="Crunch Lab logo"
              width={20}
              height={14}
            />
          </Link>
          <Badge size="sm" variant="secondary">
            Starter
          </Badge>
        </div>
        <NavigationItems />
        <SwitchToPlatformDialog />
      </nav>
      <div className="bg-border/30 min-h-px w-full" />
    </>
  );
};
