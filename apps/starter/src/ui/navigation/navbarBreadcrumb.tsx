"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@crunch-ui/core";

export const NavbarBreadcrumb: React.FC = () => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="[&_a]:lowercase!">
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground">Item 1</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem className="text-foreground normal-case">
          Item 2
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
