# Rashid Salon & Academy

Website for a unisex salon and beauty training academy in Model Town,
Jalandhar — public marketing pages plus an admin console for managing
appointments, enrollments, services, courses, stylists, gallery, and
reviews.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing
  via TanStack Router)
- [Vite](https://vitejs.dev) for dev/build tooling
- [Nitro](https://nitro.build) to produce a plain Node.js production server
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) components (Radix UI primitives)
- [Supabase](https://supabase.com) for auth, database, and storage
- [TanStack Query](https://tanstack.com/query) for data fetching/caching

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- npm (ships with Node)

### Install

```bash
npm install
```

### Environment variables

A `.env` file is already included with the Supabase connection details for
this project (URL and public/anon key — safe to expose client-side). If you
ever need to point this at a different Supabase project, update:

```
SUPABASE_URL="https://<project-ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<anon-public-key>"
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-public-key>"
```

The admin console's server-only client (`src/integrations/supabase/client.server.ts`)
also expects a `SUPABASE_SERVICE_ROLE_KEY` if you use server-side admin
operations that bypass RLS. Never expose this key to the client or commit it
to source control.

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Build for production

```bash
npm run build
```

This produces a self-contained Node server in `.output/server`.

### Run the production build

```bash
npm start
```

This runs `node .output/server/index.mjs`. Set `PORT` to change the listening
port (defaults to 3000 for the Nitro Node preset).

### Lint & format

```bash
npm run lint
npm run format
```

## Project structure

```
src/
  assets/                Images used across the site
  components/
    admin/               Shared admin console UI (CRUD table/forms)
    site/                Public-site layout, nav, footer, etc.
    ui/                  shadcn/ui primitives
  hooks/                 Shared React hooks
  integrations/supabase/ Supabase clients + auth middleware
  lib/                   Query helpers, formatting, error page
  routes/                File-based routes (TanStack Router)
  router.tsx             Router/query client setup
  server.ts              Server entry (wraps SSR errors)
  start.ts               TanStack Start middleware setup
  styles.css             Tailwind + design tokens
supabase/
  migrations/            SQL migrations for the Supabase project
```

Routes are file-based: a file named `about.tsx` maps to `/about`, a file
named `_authenticated.admin.dashboard.tsx` maps to `/admin/dashboard` and is
nested under the `_authenticated` and `admin` layout routes. See
`src/routes/README.md` for the full convention reference.

## Admin console

Routes under `/admin/*` are gated by `src/routes/_authenticated.tsx`, which
checks for a logged-in Supabase user and redirects to `/auth` otherwise.
Sign in at `/auth` with a Supabase user that has access to this project.
