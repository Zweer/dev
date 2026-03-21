---
name: steering-templates
description: Generate .kiro/steering/ files for a project. Use when setting up steering docs for code style, tooling, testing, interaction, and commit conventions.
---

# Steering Templates

Generate the 5 standard steering files under `.kiro/steering/`.

## Files

All projects get these 5 files:
1. `code-style.md` — TypeScript conventions, naming, error handling
2. `build-tooling.md` — Stack reference (tsdown, biome, lefthook, npm)
3. `testing.md` — Vitest, coverage, mocking rules
4. `interaction.md` — Agent behavior (interview, plan mode, no git commit)
5. `commit-conventions.md` — Conventional commits + gitmoji text codes

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
