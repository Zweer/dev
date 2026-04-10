# Deploy Conventions (Vercel)

## Project Setup

- Framework preset: Next.js (auto-detected)
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 22.x (match `engines` in package.json)

## Environments

| Environment | Branch | URL |
|---|---|---|
| Production | `main` | `project.vercel.app` |
| Preview | feature branches | `project-{branch}.vercel.app` |

## Environment Variables

- Set via Vercel dashboard or `vercel env` CLI
- Scope: Production / Preview / Development
- Never commit `.env.local` — it's gitignored
- Use `.env.example` as documentation for required vars

## Serverless Functions

- API routes deploy as serverless functions automatically
- Default timeout: 10s (free tier), 60s (Pro)
- Keep functions small — cold start matters
- Use Edge Runtime (`export const runtime = 'edge'`) for latency-sensitive routes

## Database

- Use connection pooling (Neon serverless driver, PlanetScale, Supabase)
- Never use long-lived connections in serverless
- Migrations run locally or in CI, not at deploy time

## Caching

- Static pages: ISR with `revalidate` or on-demand revalidation
- API responses: `Cache-Control` headers
- Client: SWR/TanStack Query with stale-while-revalidate

## Monorepo

- Set root directory in Vercel project settings if the app is in `packages/web/`
- Use `npx turbo-ignore` or custom ignore script to skip unnecessary deploys

## CI Integration

- Vercel deploys on push automatically (GitHub integration)
- CI workflow should NOT deploy — only lint, test, typecheck
- Preview deployments get automatic comments on PRs
