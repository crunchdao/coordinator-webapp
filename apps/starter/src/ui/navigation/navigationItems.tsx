"use client";
import Link from "next/link";
import { cn, generateLink } from "@crunch-ui/utils";
import { usePathname, useParams } from "next/navigation";
import { ROUTE_CONFIG } from "@/utils/routes";

export const NavigationItems: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const crunchname = params.crunchname as string;

  return (
    <nav className="flex items-center gap-3">
      {ROUTE_CONFIG.map((route) => {
        const routePath = crunchname
          ? generateLink(route.path, { crunchname })
          : route.path;
        const isActive = pathname === routePath;

        return (
          <Link
            key={route.path}
            className={cn(
              "body-sm inline-flex items-center hover:underline",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}
            href={routePath}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
};
