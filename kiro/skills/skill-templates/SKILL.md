---
name: skill-templates
description: Generate .kiro/skills/ for a project. Use when adding skills like new-package scaffolding to a monorepo.
---

# Skill Templates

Generate project-specific skills under `.kiro/skills/`.

## Available Skills

### new-package (monorepos only)
Scaffolds a new package in a monorepo. Includes:
- Directory structure, package.json, src/index.ts, test file
- README.md, CHANGELOG.md
- Updates .vscode/settings.json scopes

## When to Include

- `new-package` — Only for monorepo projects with `workspaces` in package.json

## References
- Review `references/new-package.md` for the new-package skill content
