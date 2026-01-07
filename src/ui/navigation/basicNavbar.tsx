"use client";
import Link from "next/link";
import { cn } from "@crunch-ui/utils";
import { usePathname } from "next/navigation";
import { getVisibleRoutes } from "@/utils/routes";
import { EnvironmentBadge } from "@/modules/settings/ui/environmentBadge";
import { useSettings } from "@/modules/settings/application/context/settingsContext";

export const BasicNavbar: React.FC = () => {
  const { env } = useSettings();
  const pathname = usePathname();
  const visibleRoutes = getVisibleRoutes(env);

  return (
    <nav className="sticky top-0 left-0 right-0 z-40 w-full">
      <div className="py-3 border-b z-40 w-full backdrop-blur-sm bg-card/70">
        <div className="container mx-auto flex items-center gap-3">
          {visibleRoutes.map((route) => {
            const isActive = pathname.startsWith(route.path);
            
            return (
              <Link
                key={route.path}
                className={cn(
                  "body-sm inline-flex items-center hover:underline",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
                href={route.path}
              >
                {route.label}
              </Link>
            );
          })}
          <div className="ml-auto flex gap-6 items-center">
            <EnvironmentBadge />
          </div>
        </div>
      </div>
    </nav>
  );
};
