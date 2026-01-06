# Coordinator Webapp



## Features

- **Next.js 15**: Latest version with App Router
- **TypeScript**: Type-safe code development
- **Crunch UI**: Pre-configured component library
- **React Query**: Data fetching and state management
- **TailwindCSS 4**: Utility-first CSS framework
- **Zod**: Schema validation
- **Turbopack**: Fast development experience

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm package manager

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/crunchdao/coordinator-webapp.git
   cd coordinator-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project follows the Next.js App Router structure:

```
├ src/
├── app/                 # Application routes and pages
├── modules/             # Feature-based modules
│   └── [module-name]/   # e.g., leaderboard, charts, etc.
│       ├── application/ # Zod schemas, custom hooks, contexts
│       ├── domain/      # TypeScript types and interfaces
│       ├── infrastructure/ # External services and configurations
│       └── ui/          # UI components specific to the module
├── utils/               # Utility functions
└── ...configuration files
├ public/                  # Static assets
```

## Environment Variables

Example .env file for local development:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Notes:
- NEXT_PUBLIC_API_URL should include the full base URL for your API. Example production value: https://api.example.com
- The NEXT_PUBLIC_ prefix makes this variable available in the browser. Do NOT store secrets (API keys, DB passwords) with this prefix.
- Use .env.local for local development and .env.production (or your deployment provider's secrets) for production. Do not commit .env files containing sensitive data to version control.
