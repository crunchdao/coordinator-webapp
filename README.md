# Coordinator Webapp

Monorepo for CrunchDAO coordinator web applications.

## Features

- **Next.js 16**: Latest version with App Router
- **TypeScript**: Type-safe code development
- **Crunch UI**: Pre-configured component library
- **React Query**: Data fetching and state management
- **TailwindCSS 4**: Utility-first CSS framework
- **Zod**: Schema validation
- **Turborepo**: Monorepo build system
- **Turbopack**: Fast development experience

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm package manager

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/crunchdao/coordinator-webapp.git
   cd coordinator-webapp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start a development server:

   ```bash
   # Starter app (single-node dashboard)
   pnpm dev:starter

   # Platform app (full coordinator management)
   pnpm dev:platform
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── apps/
│   ├── starter/             # Single-node dashboard app
│   └── platform/            # Full coordinator management app
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── utils/               # Shared utility functions
│   ├── leaderboard/         # Leaderboard components
│   ├── metrics/             # Metrics/analytics components
│   └── tsconfig/            # Shared TypeScript configuration
└── ...configuration files
```

Each app follows a module-based architecture:

```
src/
├── app/                     # Application routes and pages
├── modules/                 # Feature-based modules
│   └── [module-name]/
│       ├── application/     # Zod schemas, custom hooks, contexts
│       ├── domain/          # TypeScript types and interfaces
│       ├── infrastructure/  # External services and configurations
│       └── ui/              # UI components specific to the module
└── utils/                   # Utility functions
```

## Environment Variables

Default values are provided in each app's `next.config.ts`. Override them with `.env.local` for local development.

### Starter

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL_MODEL_ORCHESTRATOR=http://localhost:8001
```

### Platform

```env
NEXT_PUBLIC_COORDINATOR_NODE_API_URL=http://localhost:8000
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

> **Note**: The `NEXT_PUBLIC_` prefix makes variables available in the browser. Do not store secrets with this prefix.
