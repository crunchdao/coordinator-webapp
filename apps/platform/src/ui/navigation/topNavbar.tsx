"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";
import { CrunchBreadcrumb } from "./crunchBreadcrumb";
import { OrganizerBreadcrumb } from "./organizerBreadcrumb";

const NAV_LINKS = [
  { href: INTERNAL_LINKS.COMPETITIONS, label: "Crunches" },
  { href: INTERNAL_LINKS.ORGANIZERS, label: "Organizations" },
  { href: INTERNAL_LINKS.ONCHAIN_EXPLORER, label: "Onchain Explorer" },
];

function extractSegment(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(prefix)) return null;
  const rest = pathname.substring(prefix.length);
  const segment = rest.split("/")[0];
  return segment ? decodeURIComponent(segment) : null;
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function TopNavbar() {
  const pathname = usePathname();
  const crunchName = extractSegment(pathname, "/c/");
  const organizerName = extractSegment(pathname, "/organizers/");

  const breadcrumb = crunchName ? (
    <CrunchBreadcrumb crunchName={crunchName} />
  ) : organizerName ? (
    <OrganizerBreadcrumb organizerName={organizerName} />
  ) : null;

  return (
    <>
      <nav className="w-full py-4 px-6 bg-card/50 flex items-center gap-6">
        <Link href={INTERNAL_LINKS.ROOT}>
          <Image
            priority
            src="/images/crunch.svg"
            alt="Crunch Lab logo"
            width={20}
            height={14}
          />
        </Link>
        {breadcrumb ?? (
          <Breadcrumb>
            <BreadcrumbList className="space-x-3">
              {NAV_LINKS.map(({ href, label }) => (
                <BreadcrumbItem key={href}>
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className={cn(
                        "transition-colors",
                        isActive(pathname, href)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </nav>
      <div className="bg-border/30 min-h-px w-full" />
    </>
  );
}
