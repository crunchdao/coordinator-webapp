# Coordinator Webapp

Monorepo containing two Next.js apps for managing CrunchDAO coordinator nodes.

## Starter vs Platform

| Concern | Starter (`apps/starter/`) | Platform (`apps/platform/`) |
|---|---|---|
| **Purpose** | Single-node operator dashboard | Full coordinator management |
| **Node connection** | Single fixed node via `NEXT_PUBLIC_API_URL` | Configurable URL per crunch, multi-node |
| **Network awareness** | None — no devnet/testnet/mainnet | Full — validates network + address match |
| **Node URL editing** | No — shows status only | Yes — connection dialog with validation |
| **Checkpoints** | Read-only viewer | Full settle flow with wallet + on-chain tx |
| **Prize distribution** | View reward percentages only | USDC amounts, claim tracking, Solana links |
| **Wallet integration** | None | Full (Solana wallet adapter) |
| **Backfill** | Start, monitor, download | Start, monitor, download |
| **Ensemble toggle** | Yes | Yes |
| **Auth** | None | Login required |

**Use Starter** when you're running a single coordinator node locally or in a simple deployment and want a quick monitoring dashboard.

**Use Platform** when you need on-chain settlement, multi-crunch management, wallet integration, or network-aware features.

The Starter app prompts users to "switch to Platform mode" when they attempt on-chain actions (e.g. settling a checkpoint).

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm package manager

### Installation

```bash
git clone https://github.com/crunchdao/coordinator-webapp.git
cd coordinator-webapp
pnpm install
```

### Development

```bash
# Run the starter app
pnpm dev --filter starter

# Run the platform app
pnpm dev --filter platform
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── apps/
│   ├── starter/          # Single-node operator dashboard
│   └── platform/         # Full coordinator management
├── packages/
│   ├── chart/            # Chart components
│   ├── leaderboard/      # Leaderboard table + column config
│   ├── metrics/          # Metrics dashboard + widget config
│   ├── ui/               # Shared UI components (data-table, etc.)
│   ├── utils/            # API client, shared utilities
│   └── tsconfig/         # Shared TypeScript config
```

Each app follows a feature-module structure:

```
src/
├── app/                 # Routes and pages
├── modules/             # Feature modules
│   └── [module]/
│       ├── application/ # Hooks, schemas, contexts
│       ├── domain/      # TypeScript types
│       ├── infrastructure/ # API services, endpoints
│       └── ui/          # Components
├── ui/                  # App-level UI (navbar, navigation)
└── utils/               # Utility functions
```

## Environment Variables

### Starter App

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000              # Coordinator node report API
NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR=http://localhost:8001  # Model orchestrator API
```

### Platform App

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com            # Platform backend API
```

Notes:
- `NEXT_PUBLIC_API_URL` in the starter app points directly to the coordinator node's report worker.
- The starter app proxies all `/api/*` requests to the node — no separate backend needed.
- The `NEXT_PUBLIC_` prefix makes variables available in the browser. Do NOT store secrets with this prefix.

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript**
- **Crunch UI** component library
- **React Query** for data fetching
- **TailwindCSS 4**
- **Zod** for schema validation
- **Turborepo** for monorepo management
