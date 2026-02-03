# Environment-Based Routing Configuration Guide

This guide explains how routes are protected and displayed based on the current environment.

## Overview

The application supports three environments:
- **local**: Local environment (npm run dev, build, or start)
- **staging**: Staging environment linked to the staging branch, used to preview the Crunches and is using devnet
- **production**: Production deployment from master branch, used on production and using mainnet 

## Route Configuration

Routes are configured in `src/utils/routes.ts` with optional environment restrictions.

### Route Structure

```typescript
type RouteConfig = {
  path: string;
  label: string;
  allowedEnvs?: Environment[];  // Optional: if not specified, allowed in all environments
};
```

### Current Configuration

```typescript
export const ROUTE_CONFIG: RouteConfig[] = [
  {
    path: "/settings",
    label: "Settings",
    allowedEnvs: ["local"],  // Only accessible in local environment
  },
];
```

## Protection Mechanisms

### 1. **Middleware Protection** (Server-side)

The middleware in `src/proxy.ts` protects routes at the server level:
- Checks if the current route is allowed for the current environment
- Redirects to home page if access is denied
- Runs on all routes except API routes and static files

### 2. **Navigation Visibility** (Client-side)

The navbar only displays links for allowed routes:
- Provides clean user experience without showing inaccessible links

## Adding New Protected Routes

To add a new route with environment restrictions:

```typescript
// In src/utils/routes.ts

// 1. Add the route path
export const INTERNAL_LINKS = {
  // ... existing routes
  NEW_FEATURE: "/new-feature",
};

// 2. Add route configuration
export const ROUTE_CONFIG: RouteConfig[] = [
  // ... existing routes
  {
    path: INTERNAL_LINKS.NEW_FEATURE,
    label: "New Feature",
    allowedEnvs: ["local", "staging"],  // Not available in production
  },
];
```
