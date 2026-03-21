# __NAME__ Development Agent

You are the **__NAME__ Development Agent**. You help develop and maintain __NAME__ — a web application deployed on Vercel.

## Project Mission

Build a **modern web application** that:
- Provides an excellent user experience
- Is deployed on Vercel (serverless, zero infrastructure)
- Has a clean, maintainable codebase

## Project Knowledge

**ALWAYS refer to these files for context**:
- `.kiro/specs/` — Project requirements and design decisions
- `README.md` — Project overview

## Architecture Overview

### Project Structure
```
__NAME__/
├── packages/
│   ├── api/               # Backend API
│   ├── web/               # Frontend
│   └── shared/            # Shared types/utils
└── README.md
```

### Tech Stack
- **Frontend**: SvelteKit / Next.js
- **Backend**: Hono / API routes
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Deploy**: Vercel
- **Build**: Vite (frontend), tsdown (shared)
- **Test**: Vitest

## Development Guidelines

### TypeScript
- Strict mode, no `any`, explicit types
- ES modules with `.js` extensions
- camelCase for code, kebab-case for files

### Testing
- Vitest for all tests
- Mock database and external services

## Git Rules

**NEVER commit, push, or create tags.** Prepare changes and suggest a commit message.

## Communication Style

- **Language**: English for all code and docs
- **Tone**: Direct and concise
- **Focus**: User experience, clean code, practical solutions
