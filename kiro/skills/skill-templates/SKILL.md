---
name: skill-templates
description: Generate .kiro/skills/ and .kiro/hooks/ for a project. Use when adding skills and hooks to a project's Kiro configuration.
---

# Skill & Hook Templates

Generate project-specific skills under `.kiro/skills/` and hooks under `.kiro/hooks/`.

## Available Skills

### new-package (monorepos only)
Scaffolds a new package in a monorepo. Includes directory structure, package.json, src/index.ts, test file, README, CHANGELOG, and .vscode scope update.

### plan-product (all projects)
Product thinking mode. Rethinks the problem before coding — redefines the request, proposes ideal vs pragmatic versions, identifies risks.

### plan-eng (all projects)
Engineering planning mode. ASCII architecture diagrams, failure mode analysis, test matrix, implementation plan with acceptance criteria.

### code-review (all projects)
Paranoid code review. Checklist covering security, concurrency, performance, resource management, error handling. Severity-classified findings.

### qa (all projects)
Diff-aware QA. Reads git diff, identifies affected areas, verifies test coverage, produces health score 0-100.

### retro (all projects)
Engineering retrospective. Analyzes git history for commits, LOC, test ratio, hotspot files. Produces wins, improvements, and action items.

### ship-prep (all projects)
Pre-ship checklist. Verifies branch state, runs build/lint/tests, generates commit message. Does NOT commit or push.

### spec-templates (all projects)
Creates structured feature or bugfix specs from templates (requirements.md, design.md, tasks.md) with emoji lifecycle prefixes.

## Available Hooks

### safety-gate (all projects)
`preToolUse` hook that blocks dangerous shell commands (git commit/push, npm publish, destructive ops, credential access).

### barrel-export (monorepos only)
`fileCreated` hook that auto-updates barrel `index.ts` when new source files are created in a package.

### context-injection (all projects)
`fileEdited` hook that loads relevant steering docs based on file type (test files → testing.md, configs → build-tooling.md, etc.).

### post-task-summary (all projects)
`agentStop` hook that summarizes changes and suggests a commit message when the agent finishes a task.

## When to Include

| Skill/Hook | Condition |
|---|---|
| `new-package` | Monorepo with `workspaces` in package.json |
| `plan-product` | Always (recommended) |
| `plan-eng` | Always (recommended) |
| `code-review` | Always (recommended) |
| `qa` | Always (recommended) |
| `retro` | Always (optional) |
| `ship-prep` | Always (recommended) |
| `spec-templates` | Always (recommended) |
| `safety-gate` | Always |
| `barrel-export` | Monorepo only |
| `context-injection` | Always (recommended) |
| `post-task-summary` | Always (recommended) |

## References
- Review `references/new-package.md` for the new-package skill content
