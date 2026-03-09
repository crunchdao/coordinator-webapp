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
} from "@crunch-ui/core";
import { ExternalLink, SmallCross } from "@crunch-ui/icons";
import { useHubAuth } from "../application/context/hubAuthContext";

const HUB_ACCOUNT_URL = "https://hub.crunchdao.com/account/settings";

export function HubLoginButton() {
  const { isAuthenticated, isLoading, user, login, logout } = useHubAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" onClick={login}>
        Connect to Hub
      </Button>
    );
  }
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
          onSelect={() => window.open(HUB_ACCOUNT_URL, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          My Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onSelect={logout}>
          <SmallCross className="h-4 w-4 mr-2" />
          Disconnect from Hub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
