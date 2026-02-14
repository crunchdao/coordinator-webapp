---
name: coordinator-webapp
description: Use when building features, adding pages, creating modules, or modifying UI in the coordinator webapp monorepo. Covers the starter app (single-node dashboard) and platform app (full coordinator management), shared packages, module patterns, API proxy, and report schema integration.
---

# Coordinator Webapp

Next.js 16 monorepo with two apps and shared packages for managing CrunchDAO coordinator nodes.

## When to Use

- Adding a new page or feature to starter or platform app
- Creating a new module (domain/infrastructure/application/ui)
- Wiring up a new backend endpoint from the coordinator node
- Working with the report schema (leaderboard columns, metric widgets)
- Adding shared components to `packages/`

## Architecture

### Two Apps, Different Concerns

| | Starter (`apps/starter/`) | Platform (`apps/platform/`) |
|---|---|---|
| Node connection | Single fixed node via `NEXT_PUBLIC_API_URL` | Configurable URL per crunch, multi-node |
| Network/wallet | None — no devnet/testnet, no wallet | Full — network validation, Solana wallet |
| Auth | None | Login required |
| Checkpoints | Read-only (settle → "switch to Platform" dialog) | Full on-chain settlement |
| API routing | Next.js rewrites proxy `/api/*` → node | Direct calls via configurable node URL |

**Rule:** Starter has zero network/wallet awareness. If a feature needs on-chain interaction, show a "switch to Platform" upgrade prompt instead.

### Shared Packages (`packages/`)

| Package | Contains |
|---|---|
| `@coordinator/leaderboard` | LeaderboardTable, ColumnSettingsTable, column types/schemas |
| `@coordinator/metrics` | MetricsDashboard, MetricSettingsTable, widget types, `useMetricData` |
| `@coordinator/ui` | DataTable, LogsList, FormatSelect, MultiSelectDropdown |
| `@coordinator/utils` | `apiClient` (baseURL `/api`), `configApiClient` (no baseURL), number formatter |

Import shared components as: `import { DataTable } from "@coordinator/ui/src/data-table"`
Import shared types as: `import { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types"`

### UI Components

Use `@crunch-ui/core` for primitives — not raw HTML or custom Tailwind components:
```
Card, CardHeader, CardTitle, CardDescription, CardContent
Table, TableHeader, TableRow, TableHead, TableBody, TableCell
Button, Badge, Input, Label, Select, Switch, Dialog, Spinner
Form, FormField, FormItem, FormLabel, FormControl, FormMessage
Tooltip, TooltipTrigger, TooltipContent
```

Icons from `@crunch-ui/icons`: `InfoCircle, Plus, Trash, Copy, Check, Search, Settings`

Utilities: `cn()` from `@crunch-ui/utils`, `generateLink()` for parameterized routes.

## Module Pattern

Every feature follows this structure:

```
modules/
  feature-name/
    domain/
      types.ts              # TypeScript interfaces, no logic
    infrastructure/
      endpoints.ts          # URL constants: () => "/reports/..."
      services.ts           # API calls using apiClient
    application/
      hooks/
        useGetThing.tsx      # react-query useQuery wrapper
        useCreateThing.tsx   # react-query useMutation wrapper
      schemas/
        thingSchema.ts       # Zod schemas (if forms needed)
      context/
        thingContext.tsx      # React context (if needed)
    ui/
      thingList.tsx          # Main UI component
      thingDetail.tsx        # Detail/expanded view
```

### Quick Reference: Adding a Feature

1. **Types** — `domain/types.ts`: interfaces matching the backend response
2. **Endpoints** — `infrastructure/endpoints.ts`: URL builder functions
3. **Services** — `infrastructure/services.ts`: `apiClient.get/post/put/delete` calls
4. **Hooks** — `application/hooks/`: one hook per operation, react-query
5. **UI** — `ui/`: components using `@crunch-ui/core` + shared packages
6. **Page** — `app/feature-name/page.tsx`: import UI component, add metadata
7. **Route** — `utils/routes.ts`: add to `INTERNAL_LINKS` and `ROUTE_CONFIG`

### API Patterns

**Starter app** — proxies through Next.js rewrites:
```ts
// next.config.ts rewrites /api/* → NEXT_PUBLIC_API_URL/*
// So apiClient (baseURL: "/api") calls like:
apiClient.get("/reports/checkpoints")  // → http://localhost:8000/reports/checkpoints
```

**Two API clients:**
- `apiClient` (`@coordinator/utils/src/api`) — baseURL `/api`, for proxied node calls
- `configApiClient` (`@coordinator/utils/src/config-api`) — no baseURL, for local Next.js API routes (`/api/settings`, `/api/leaderboard/columns`)

**Local config routes** (Next.js API routes that read/write JSON files in `config/`):
- `/api/settings` — global settings (endpoints, container names)
- `/api/leaderboard/columns` — column config with report schema merge
- `/api/metrics/widgets` — widget config with report schema merge

### React Query Conventions

```tsx
// Read hook pattern
export function useGetThings(filter?: string) {
  const query = useQuery({
    queryKey: ["things", filter],
    queryFn: () => getThings(filter),
    retry: false,
    refetchInterval: 30_000,  // or conditional: (query) => hasActive ? 5_000 : 30_000
  });
  return {
    things: query.data ?? [],
    thingsLoading: query.isLoading,
    thingsError: query.error,
  };
}

// Mutation hook pattern
export function useCreateThing() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (body: CreateThingRequest) => createThing(body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["things"] }); },
  });
  return {
    createThing: mutation.mutate,
    createThingLoading: mutation.isPending,
  };
}
```

### Page Pattern

```tsx
// app/feature-name/page.tsx
import { Metadata } from "next";
import { FeatureComponent } from "@/modules/feature/ui/featureComponent";

export const metadata: Metadata = {
  title: "Feature Name",
  description: "One line description",
};

export default function FeaturePage() {
  return <FeatureComponent />;
}
```

Pages are thin — all logic lives in module hooks/components.

### Navigation

```ts
// utils/routes.ts
export const INTERNAL_LINKS = { ..., FEATURE: "/feature-name" } as const;

export const ROUTE_CONFIG: RouteConfig[] = [
  ...
  { path: INTERNAL_LINKS.FEATURE, label: "Feature" },
  // Conditionally visible:
  { path: INTERNAL_LINKS.FEATURE, label: "Feature", visibilityKey: "feeds" },
];
```

Visibility keys are resolved in `navigationItems.tsx` via `useRouteVisibility()`.

## Report Schema Flow

The coordinator node auto-generates a report schema from its `CrunchContract`. The webapp merges this with local overrides:

```
Node: /reports/schema → { leaderboard_columns, metrics_widgets }
                              ↓
Webapp: fetchReportSchema() → mergeLeaderboardColumns(backend, overrides) → response
                              ↓
Local overrides: config/leaderboard-columns.json (edited via UI)
```

Key file: `app/api/_lib/reportSchema.ts` — handles fetch, merge, deep-merge logic.

When adding new schema-driven features, the backend schema is the source of truth. Local overrides customize display (names, tooltips, order, format) but don't add new data fields.

## Styling

- Dark theme by default (HSL color tokens in `globals.css`)
- Use `@crunch-ui/core` components, not raw HTML
- Use `cn()` for conditional classes
- Card with `displayCorners` prop for featured sections
- Tables: use `@crunch-ui/core` Table components or `@coordinator/ui` DataTable
- Status indicators: `Badge` with variant (`success`, `destructive`, `outline`, `secondary`)
- Loading: `Spinner` component, not custom spinners

## Platform-Specific Patterns

The platform app has additional concerns not in starter:

- **Auth**: `RestrictedWrapper`, login flow
- **Crunch context**: `CrunchProvider` wraps crunch-specific routes
- **Node connection context**: `NodeConnectionProvider` with configurable URL, address mismatch detection
- **Wallet**: Solana wallet adapter integration
- **On-chain**: `SolanaAddressLink`, checkpoint settlement, staking

Route structure: `/[crunchname]/feature` with `useParams()` for crunch name.

## Build & Dev

```bash
pnpm dev --filter @coordinator/starter    # Starter app
pnpm dev --filter @coordinator/platform   # Platform app
pnpm build --filter @coordinator/starter  # Build check
```

TypeScript check: `npx tsc --noEmit --project apps/starter/tsconfig.json`
