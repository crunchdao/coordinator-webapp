"use client";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { useGetCoordinatorCrunches } from "@/modules/crunch/application/hooks/useGetCoordinatorCrunches";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Skeleton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@crunch-ui/core";
import { ChevronDown } from "@crunch-ui/icons";
import { INTERNAL_LINKS, PAGE_LABELS } from "@/utils/routes";

export const NavbarBreadcrumb: React.FC = () => {
  const { coordinator, isLoading } = useAuth();
  const { crunches, crunchesPending } = useGetCoordinatorCrunches();
  const params = useParams();
  const pathname = usePathname();

  const currentCrunchName = params.crunchname as string;
  const coordinatorName = coordinator?.name;
  const pathSegment = pathname.split("/")[1];
  const pageLabel = PAGE_LABELS[pathSegment] || pathSegment;

  return (
    <Breadcrumb>
      <BreadcrumbList className="[&_a]:lowercase!">
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground">
          {isLoading ? (
            <Skeleton className="w-32 h-4" />
          ) : currentCrunchName ? (
            <Link href={INTERNAL_LINKS.DASHBOARD}>{coordinatorName}</Link>
          ) : (
            <span>{coordinatorName || pageLabel}</span>
          )}
        </BreadcrumbItem>
        {currentCrunchName && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground normal-case">
              {crunchesPending ? (
                <Skeleton className="w-32 h-4" />
              ) : crunches && crunches.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 normal-case!">
                    {currentCrunchName}
                    <ChevronDown className="size-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {crunches.map((crunch, index) => {
                      const pathSegments = pathname.split("/");
                      const crunchIndex = pathSegments.findIndex(
                        (seg) => seg === currentCrunchName
                      );
                      if (crunchIndex !== -1) {
                        pathSegments[crunchIndex] = crunch.name;
                      }
                      const newPath = pathSegments.join("/");

                      return (
                        <DropdownMenuItem key={index} asChild>
                          <Link href={newPath}>{crunch.name}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="normal-case!">{currentCrunchName}</span>
              )}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
