---
name: steering-templates
description: Generate .kiro/steering/ files for a project. Use when setting up steering docs for code style, tooling, testing, interaction, and commit conventions.
---

# Steering Templates

Generate the `.kiro/steering/` files for a project.

## Core Files (always generated)

All projects get these 5 files:
1. `code-style.md` — TypeScript conventions, naming, error handling, language policy
2. `build-tooling.md` — Stack reference (tsdown, biome, lefthook, npm)
3. `testing.md` — Vitest, coverage, mocking rules
4. `interaction.md` — Agent behavior (interview, plan mode, no git commit)
5. `commit-conventions.md` — Conventional commits + gitmoji text codes

## Web App Files (opt-in)

Generate these when the project is a web application:
- `web-nextjs.md` — Next.js conventions (App Router, Server Components, data fetching, components, Tailwind)
- `web-deploy.md` — Vercel deploy conventions (environments, serverless, caching, monorepo)

Only include if the project uses Next.js + Vercel. **Ask the user** if unsure.

## Language-Specific Files (opt-in)

Only generate these when the project explicitly declares the language in its stack:
- `code-style-python.md` — Python conventions (uv, ruff, type hints, naming)
- `code-style-flutter.md` — Flutter/Dart conventions (widgets, state management)
- `build-tooling-python.md` — Python build stack (uv, ruff, pyproject.toml)
- `testing-python.md` — pytest, coverage, fixtures

**Ask the user** which languages the project uses. Never assume a secondary language.

## Customization

Adapt each file to the project:
- `build-tooling.md` — Add project-specific scripts, build commands, deploy info
- `testing.md` — Add project-specific test patterns (e.g., PGlite for DB tests)
- `code-style.md` — Add project-specific conventions (e.g., Svelte component style)

## References
- Review `references/code-style.md` for the code style template
- Review `references/build-tooling.md` for the build tooling template
- Review `references/testing.md` for the testing template
- Review `references/interaction.md` for the interaction template
- Review `references/commit-conventions.md` for the commit conventions template
- Review `references/web-nextjs.md` for the Next.js conventions template
- Review `references/web-deploy.md` for the Vercel deploy template
