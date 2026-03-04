"use client";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@crunch-ui/core";
import { SmallCross } from "@crunch-ui/icons";
import { useHubAuth } from "../application/context/hubAuthContext";

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
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase() || "H"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm hidden md:inline">{user?.username}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-destructive" onSelect={logout}>
          <SmallCross className="h-4 w-4 mr-2" />
          <span>Disconnect from Hub</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
