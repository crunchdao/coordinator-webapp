"use client";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useCoordinatorAuth } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";
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
  const { coordinator: authCoordinator, isLoading } = useCoordinatorAuth();
  const { coordinator } = useGetCoordinator();
  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator?.address ? { coordinator: coordinator.address } : undefined
  );
  const params = useParams();
  const pathname = usePathname();

  const currentCrunchName = params.crunchname as string;
  const coordinatorName = authCoordinator?.name;
  const pathSegment = pathname.split("/")[1];
  const pageLabel = PAGE_LABELS[pathSegment] || pathSegment;

  return (
    <Breadcrumb>
      <BreadcrumbList className="[&_*]:!normal-case">
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground">
          {isLoading ? (
            <Skeleton className="w-32 h-4" />
          ) : currentCrunchName ? (
            <Link href={INTERNAL_LINKS.DASHBOARD}>
              {coordinatorName?.toLowerCase()}
            </Link>
          ) : (
            <span>{coordinatorName?.toLowerCase() || pageLabel}</span>
          )}
        </BreadcrumbItem>
        {currentCrunchName && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground normal-case!">
              {crunchesLoading ? (
                <Skeleton className="w-32 h-4" />
              ) : crunches && crunches.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 normal-case!">
                    {currentCrunchName?.toLocaleLowerCase()}
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
