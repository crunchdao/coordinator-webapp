"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Badge,
} from "@crunch-ui/core";
import { Check, SmallCross } from "@crunch-ui/icons";
import { useHubAuth } from "../application/context/hubAuthContext";

export function HubLoginButton() {
  const { staging, production, login, logout } = useHubAuth();

  const isLoading = staging.isLoading || production.isLoading;
  const isAnyConnected = staging.isAuthenticated || production.isAuthenticated;

  if (isLoading) {
    return null;
  }

  if (!isAnyConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Connect to Hub
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => login("staging")}>
            Staging
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => login("production")}>
            Production
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const user = production.user ?? staging.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.login?.charAt(0).toUpperCase() || "nd"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user?.login}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={staging.isAuthenticated}
          onSelect={() => login("staging")}
        >
          Staging
          {staging.isAuthenticated && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={production.isAuthenticated}
          onSelect={() => login("production")}
        >
          Production
          {production.isAuthenticated && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onSelect={logout}>
          <SmallCross className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
