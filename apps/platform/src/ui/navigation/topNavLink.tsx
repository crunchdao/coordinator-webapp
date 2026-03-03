"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@crunch-ui/utils";

interface TopNavLinkProps {
  href: string;
  label: string;
}

export function TopNavLink({ href, label }: TopNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
}
