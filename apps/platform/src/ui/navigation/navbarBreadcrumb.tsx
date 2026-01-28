"use client";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@coordinator/auth/src/application/context/authContext";
import { useSettings } from "@coordinator/settings/src/application/context/settingsContext";
import { CoordinatorStatus } from "@coordinator/crunch/src/domain/types";
import { useGetCoordinatorCrunches } from "@coordinator/crunch/src/application/hooks/useGetCoordinatorCrunches";
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
import { INTERNAL_LINKS } from "@coordinator/utils/src/routes";
import { LOCAL_COORDINATOR_NAME } from "@coordinator/utils/src/config";

export const NavbarBreadcrumb: React.FC = () => {
  const { coordinator, coordinatorStatus, isLoading } = useAuth();
  const { crunches, crunchesPending } = useGetCoordinatorCrunches();
  const { isLocal } = useSettings();
  const params = useParams();
  const pathname = usePathname();

  const currentCrunchName = params.crunchname as string;
  const unregistered =
    !isLoading && coordinatorStatus === CoordinatorStatus.UNREGISTERED;

  const coordinatorName = isLocal ? LOCAL_COORDINATOR_NAME : coordinator?.name;

  return (
    <Breadcrumb>
      <BreadcrumbList className="[&_a]:lowercase!">
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground">
          {isLoading ? (
            <Skeleton className="w-32 h-4" />
          ) : unregistered ? (
            <Link href={INTERNAL_LINKS.REGISTER}>Register</Link>
          ) : (
            <Link href={INTERNAL_LINKS.DASHBOARD}>{coordinatorName}</Link>
          )}
        </BreadcrumbItem>
        {!unregistered && currentCrunchName && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground normal-case">
              {!isLocal && crunchesPending ? (
                <Skeleton className="w-32 h-4" />
              ) : !isLocal && crunches && crunches.length > 1 ? (
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
