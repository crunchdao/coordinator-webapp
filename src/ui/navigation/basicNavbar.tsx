"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@crunch-ui/utils";
import { INTERNAL_LINKS, getVisibleRoutes } from "@/utils/routes";
import { EnvironmentBadge } from "@/modules/settings/ui/environmentBadge";
import { useSettings } from "@/modules/settings/application/context/settingsContext";
import { WalletConnection } from "@/modules/wallet/ui/walletConnection";
import { RestrictedWrapper } from "@/modules/auth/ui/restrictedWrapper";

export const BasicNavbar: React.FC = () => {
  const { env } = useSettings();
  const visibleRoutes = getVisibleRoutes(env);

  const linkClassName =
    "body-sm text-muted-foreground inline-flex items-center gap-1.5 uppercase hover:underline";

  return (
    <nav className="sticky top-0 left-0 right-0 z-40 w-full">
      <div className="py-3 border-b mb-3 z-40 w-full backdrop-blur-sm bg-background/70">
        <div className="container mx-auto flex justify-between">
          <div className="flex items-center gap-3">
            <Link href={INTERNAL_LINKS.ROOT}>
              <Image
                priority
                src="/images/crunch-lab-logo.svg"
                alt="Crunch Lab logo"
                width={107}
                height={20}
              />
            </Link>
            <EnvironmentBadge />
          </div>
          <div className="ml-auto flex gap-6 items-center">
            <RestrictedWrapper showDefaultMessage={false}>
              {visibleRoutes.map((route) => (
                <Link
                  key={route.path}
                  className={cn(linkClassName)}
                  href={route.path}
                >
                  {route.label}
                </Link>
              ))}
            </RestrictedWrapper>
            <WalletConnection />
          </div>
        </div>
      </div>
    </nav>
  );
};
