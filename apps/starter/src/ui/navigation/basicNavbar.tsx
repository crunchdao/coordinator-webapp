"use client";
import Link from "next/link";
import { cn, generateLink } from "@crunch-ui/utils";
import { usePathname, useParams } from "next/navigation";
import { ROUTE_CONFIG } from "@/utils/routes";

export const BasicNavbar: React.FC = () => {
  const pathname = usePathname();
  const params = useParams();
  const crunchname = params.crunchname as string;

  return (
    <nav className="sticky top-0 left-0 right-0 py-4 px-6 z-40 w-full backdrop-blur-sm bg-card/50">
      <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
};
