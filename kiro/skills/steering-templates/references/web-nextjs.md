# Next.js Conventions

## App Router

- Use App Router (`app/` directory), not Pages Router
- Server Components by default — add `'use client'` only when needed (event handlers, hooks, browser APIs)
- Colocate related files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` in the same route folder

## Data Fetching

- Server Components fetch data directly (no `useEffect`)
- Use `fetch()` with Next.js caching or `unstable_cache` for server-side caching
- Client-side: use SWR or TanStack Query, never raw `useEffect` + `fetch`

## Route Handlers

- API routes in `app/api/` using `route.ts` files
- Always validate input (Zod schemas)
- Return proper HTTP status codes and typed responses

## Components

```
components/
├── ui/           # Generic reusable (Button, Card, Input)
├── features/     # Feature-specific (UserProfile, DashboardChart)
└── layouts/      # Layout components (Header, Sidebar, Footer)
```

- One component per file, named export matching filename
- Props interface defined and exported above the component
- Use `cn()` (clsx + tailwind-merge) for conditional classes

## Styling

- Tailwind CSS for all styling
- No inline styles, no CSS modules (unless third-party requires it)
- Design tokens via Tailwind config (`colors`, `spacing`, `fontSize`)
- Dark mode via `class` strategy

## Performance

- Use `next/image` for all images (automatic optimization)
- Use `next/link` for all internal navigation
- Dynamic imports (`next/dynamic`) for heavy client components
- Metadata API for SEO (`generateMetadata`)

## Environment Variables

- Server-only: `process.env.VAR_NAME` (no prefix)
- Client-exposed: `NEXT_PUBLIC_` prefix
- Validate at startup with Zod schema in `env.ts`
- Never log or expose server env vars to the client
