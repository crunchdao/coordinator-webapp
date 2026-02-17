# Starter App: Node Features Integration

**Date:** 2026-02-14
**Status:** Approved

## Overview

Integrate new coordinator-node-starter backend features into the starter webapp. Four workstreams: node status indicator, checkpoints page, backfill management, and ensemble toggle. Also clarify starter vs platform app distinction in the README.

## Starter vs Platform App Distinction

| Concern | Starter (`apps/starter/`) | Platform (`apps/platform/`) |
|---|---|---|
| Node connection | Single fixed node via `NEXT_PUBLIC_API_URL` | Configurable URL per crunch, multi-node |
| Network awareness | None — no devnet/testnet/mainnet | Full — validates network + address match |
| Node URL editing | No | Yes, with connection dialog |
| Checkpoints | Read-only viewer | Full settle flow with wallet + on-chain tx |
| Prize distribution | View reward percentages only | USDC amounts, claim tracking, Solana links |
| Wallet integration | None | Full (Solana wallet adapter) |
| Backfill | Start/monitor/download | Start/monitor/download |
| Ensemble toggle | Yes | Yes |

The starter app prompts users to "switch to Platform mode" when they attempt on-chain actions (e.g. settling a checkpoint).

## 1. Node Status Indicator

**Location:** Top navbar, next to the "Starter" badge.

**Components:**
- `modules/node/infrastructure/services.ts` — calls `GET /api/info` and `GET /api/healthz`
- `modules/node/application/hooks/useNodeHealth.tsx` — polls health every 15s, info every 60s
- `modules/node/ui/nodeStatusBadge.tsx` — green/red dot + crunch_id label; tooltip shows model/feed/checkpoint counts

**Behavior:**
- Green dot + crunch ID when `/healthz` returns `{status: "ok"}`
- Red dot + "Offline" when unreachable
- No URL editing, no network display, no address mismatch detection
- Tooltip: crunch_id, model count, feed count, checkpoint count (fetched from `/api/reports/models`, `/api/reports/feeds`, `/api/reports/checkpoints`)

**Types:**
```ts
interface NodeHealth { status: string }
interface NodeInfo { crunch_id: string; crunch_address: string; network: string }
```

## 2. Checkpoints Page

**Route:** `/checkpoints` — new nav item between Feeds and Settings.

**Module:** `modules/checkpoint/`

**Types** (`domain/types.ts`):
```ts
type NodeCheckpointStatus = "PENDING" | "SUBMITTED" | "CLAIMABLE" | "PAID"

interface NodeCheckpoint {
  id: string
  period_start: string
  period_end: string
  status: NodeCheckpointStatus
  entries: NodeEmission[]
  meta: { snapshot_count?: number; model_count?: number; ranking?: NodeRankedEntry[] }
  created_at: string
  tx_hash: string | null
  submitted_at: string | null
}
```

Reuse the same types already defined in `apps/platform/src/modules/checkpoint/domain/nodeTypes.ts`. Copy into starter (no cross-app imports).

**Service** (`infrastructure/services.ts`):
- `getCheckpoints(status?)` → `GET /api/reports/checkpoints?status=`
- `getCheckpointPrizes(id)` → `GET /api/reports/checkpoints/{id}/prizes`

**Hooks:**
- `useGetCheckpoints(status?)` — react-query, refetch 30s
- `useGetCheckpointDetail(id)` — fetches prizes on demand

**UI** (`ui/checkpointList.tsx`):
- Status filter dropdown (All / Pending / Submitted / Claimable / Paid)
- Table columns: ID (truncated), Period, Status badge, Models, Created
- Row click → expand detail card: ranked model list with reward %, snapshot count
- PENDING rows show a "Settle" button → opens `SwitchToPlatformDialog`

**UI** (`ui/switchToPlatformDialog.tsx`):
- Dialog title: "On-Chain Features"
- Body: "Settling checkpoints on-chain requires the Platform edition. Switch to Platform mode to enable wallet integration, on-chain settlement, and prize distribution."
- Actions: [Learn More] [Dismiss]

Note: `modules/settings/ui/switchToPlatformDialog.tsx` already exists — reuse or generalize it.

## 3. Backfill Management Page

**Route:** `/backfill` — new nav item, conditionally visible when feeds exist (same pattern as `/feeds`).

**Module:** `modules/backfill/`

**Types** (`domain/types.ts`):
```ts
type BackfillJobStatus = "RUNNING" | "COMPLETED" | "FAILED"

interface BackfillJob {
  id: string
  source: string; subject: string; kind: string; granularity: string
  start_ts: string; end_ts: string; cursor_ts: string | null
  records_written: number; pages_fetched: number
  status: BackfillJobStatus; error: string | null
  created_at: string; updated_at: string
  progress_pct?: number
}

interface BackfillFile {
  source: string; subject: string; kind: string; granularity: string
  filename: string; size_bytes: number; record_count: number
}
```

**Service** (`infrastructure/services.ts`):
- `getBackfillFeeds()` → `GET /api/reports/backfill/feeds`
- `startBackfill(body)` → `POST /api/reports/backfill`
- `getBackfillJobs(status?)` → `GET /api/reports/backfill/jobs`
- `getBackfillJob(id)` → `GET /api/reports/backfill/jobs/{id}`
- `getBackfillIndex()` → `GET /api/data/backfill/index`

**Hooks:**
- `useBackfillFeeds()` — list eligible feeds
- `useStartBackfill()` — mutation, invalidates jobs query
- `useBackfillJobs()` — refetch 5s while any job RUNNING, else 30s
- `useBackfillIndex()` — list downloadable files

**UI** (`ui/backfillManager.tsx`):
Three sections:
1. **Start Backfill** card — dropdowns for source/subject/kind/granularity (from feeds), date range pickers, "Start" button. Disabled when a job is RUNNING.
2. **Jobs** table — source:subject:kind:granularity, status badge, progress bar, records, pages, created. Running job highlighted.
3. **Data Files** card — table of parquet files with download links to `/api/data/backfill/{path}`.

## 4. Ensemble Toggle

**Leaderboard page** (`app/leaderboard/page.tsx`):
- Add `showEnsembles` state (default false)
- Render a Switch labeled "Show Ensembles" above the table
- Pass `?include_ensembles=true` to the leaderboard endpoint when toggled on
- In the leaderboard table, detect `__ensemble_` prefix models and show an "Ensemble" badge

**Metrics page** (`app/metrics/page.tsx`):
- Same switch
- Pass through to `/reports/models/global` and `/reports/models/params`

**Changes to existing hooks:**
- `useGetLeaderboard` — accept optional `includeEnsembles: boolean` param, append to query key and endpoint
- `useGetModelList` — no change needed (models endpoint doesn't filter ensembles)

No persistence — toggle resets on page navigation.

## 5. README Update

Replace the current README with a clear feature comparison between starter and platform apps (table from the distinction section above). Include:
- When to use each app
- Environment variables per app
- Feature matrix
- Explicit note: starter has no network/wallet awareness by design

## Navigation Updates

Updated `ROUTE_CONFIG`:
```ts
{ path: "/checkpoints", label: "Checkpoints" }
{ path: "/backfill", label: "Backfill", visibilityKey: "feeds" }
```

Checkpoints always visible. Backfill conditionally visible (same as Feeds).

## Implementation Order

1. Node status badge (navbar) — smallest, unblocks visual verification
2. README update — clarifies architecture for all subsequent work
3. Ensemble toggle — small change to existing pages
4. Checkpoints page — new page, reuses patterns from feeds/leaderboard
5. Backfill management — new page, most complex
