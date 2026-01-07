"use client";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { useGetCoordinatorCrunches } from "@/modules/coordinator/application/hooks/useGetCoordinatorCrunches";
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

export const NavbarBreadcrumb: React.FC = () => {
  const { coordinator, coordinatorStatus, isLoading } = useAuth();
  const { crunches, crunchesPending } = useGetCoordinatorCrunches();
  const unregistered =
    !isLoading && coordinatorStatus === CoordinatorStatus.UNREGISTERED;

  console.log("Coordinator crunches:", crunches);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground normal-case">
          {isLoading ? (
            <Skeleton className="w-32 h-4" />
          ) : unregistered ? (
            "Register"
          ) : (
            coordinator?.name
          )}
        </BreadcrumbItem>
        {!unregistered && crunches && crunches.length > 0 && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem className="text-foreground normal-case">
              {crunchesPending ? (
                <Skeleton className="w-32 h-4" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1 normal-case!">
                    {crunches[0].name}
                    <ChevronDown className="size-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {crunches.map((crunch, index) => (
                      <DropdownMenuItem key={index}>
                        {crunch.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
