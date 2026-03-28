# @zweer/dev v2 — Complete Redesign Specification

## 1. Project Vision

@zweer/dev is a central repository of reusable configurations, best practices, and AI-assisted development tooling for all of Zweer's personal projects. It provides:

1. **A CLI tool** (`dev`) for scaffolding and configuring projects
2. **Golden config files** for linting, formatting, building, testing
3. **Kiro configurations** (agents, steering, skills) for AI-assisted development
4. **GitHub Actions workflows** for CI/CD

This repo will also serve as the **starting point** for a future company-level repo with stricter rules (AWS CDK only, corporate pipelines, review processes, etc.). The two repos will diverge after the initial fork — they are NOT meant to stay in sync.

### Key Differences: Personal vs Company

| Aspect | @zweer/dev (personal) | Company repo (future) |
|--------|----------------------|----------------------|
| Deploy platform | Vercel (free tier) | AWS (CDK only) |
| Infrastructure | None / Vercel managed | CDK stacks, ECS, Lambda |
| Release tool | bonvoy | bonvoy + corporate pipeline lib |
| Review process | Self-review | Domain expert / solution owner review |
| Documentation | VitePress in `docs/` folder | Corporate standard format |
| Strictness | Flexible, opinionated | Rigid, policy-enforced |

---

## 2. What Exists Today (v1)

The current repo is heavily conditioned by CAO (CLI Agent Orchestrator), which is now obsolete with Kiro's native features (steering, skills, hooks, agents).

### Current structure to remove/replace:

- `agents/` — 30 CAO agent markdown files (8 categories). Content is valuable but format is obsolete.
- `.amazonq/` — Legacy Amazon Q config. Replace with `.kiro/`.
- `.husky/` + `.lintstagedrc` — Replace with lefthook.
- `templates/` — CAO orchestrator templates. Replace with project scaffold templates.
- `cli/commands/cao/` — All CAO-related CLI commands. Remove entirely.
- `cli/utils/cao.ts`, `cli/utils/agents.ts` — CAO utilities. Remove.
- `test/commands/cao/`, `test/utils/cao.test.ts`, `test/utils/agents.test.ts` — CAO tests. Remove.
- `coverage/` — Should be gitignored, not committed.
- `package.json` `release` config — Uses semantic-release. Migrate to bonvoy.

### Current structure to keep/evolve:

- `cli/index.ts` — CLI entry point (commander). Keep, update commands.
- `cli/commands/bootstrap.ts` — Keep, update to new config set.
- `cli/commands/setup.ts` — Keep, update to new config set.
- `biome.json` — Keep, update to latest schema + align with other repos.
- `.editorconfig` — Keep as-is (identical across all repos).
- `tsconfig.json` — Keep, update options.
- `vitest.config.ts` — Keep, add coverage config.
- `.github/workflows/` — Keep, update action versions.
- `.github/dependabot.yml` — Keep.
- `.npmpackagejsonlintrc.json` — Keep, align with FlowRAG/bonvoy config.
- `package.json` — Keep, major updates to deps and scripts.

---

## 3. New Repository Structure

```
@zweer/dev/
├── cli/                              # CLI tool
│   ├── index.ts                      # Entry point (commander)
│   └── commands/
│       ├── bootstrap.ts              # Scaffold new project from scratch
│       ├── setup.ts                  # Add configs to existing project
│       └── init-kiro.ts              # Install zweer-setup agent globally
│
├── configs/                          # Golden config files (copied to target projects)
│   ├── biome.json
│   ├── editorconfig                  # Note: no dot prefix (added on copy)
│   ├── commitlint.config.ts
│   ├── lefthook.yml
│   ├── lockfile-lintrc.json
│   ├── npmpackagejsonlintrc.json
│   ├── tsconfig.json
│   ├── tsdown.config.ts
│   └── vitest.config.ts
│
├── kiro/                             # Kiro configurations (used by zweer-setup agent)
│   ├── agents/
│   │   └── zweer-setup.json          # The agent that configures Kiro for projects
│   ├── prompts/
│   │   └── zweer-setup.md            # Prompt for the setup agent
│   ├── steering/                     # Steering templates (copied to target projects)
│   │   ├── code-style.md
│   │   ├── build-tooling.md
│   │   ├── testing.md
│   │   ├── interaction.md
│   │   └── commit-conventions.md
│   └── skills/                       # Skills for the zweer-setup agent
│       ├── agent-template/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── base.json
│       │       ├── example-monorepo-library.json
│       │       └── example-webapp-vercel.json
│       ├── prompt-template/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── example-library.md
│       │       └── example-webapp.md
│       ├── steering-templates/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── code-style.md
│       │       ├── build-tooling.md
│       │       ├── testing.md
│       │       ├── interaction.md
│       │       └── commit-conventions.md
│       └── skill-templates/
│           ├── SKILL.md
│           └── references/
│               └── new-package.md
│
├── workflows/                        # GitHub Actions (copied to target projects)
│   ├── base/                         # Always installed
│   │   ├── ci.yml
│   │   ├── pr.yml
│   │   ├── security.yml
│   │   └── dependabot-auto-merge.yml
│   ├── library/                      # Only for npm libraries
│   │   └── npm.yml
│   └── docs/                         # Only if project has VitePress docs
│       └── docs.yml
│
├── templates/                        # Scaffold templates for `dev bootstrap`
│   ├── monorepo/                     # Monorepo with packages/*
│   └── single/                       # Single package project
│
├── .kiro/                            # Kiro config for THIS repo itself
│   ├── agents/
│   │   └── dev.json
│   ├── prompts/
│   │   └── dev.md
│   ├── steering/
│   │   ├── code-style.md
│   │   ├── build-tooling.md
│   │   ├── testing.md
│   │   ├── interaction.md
│   │   └── commit-conventions.md
│   ├── skills/
│   │   └── ... (as needed)
│   └── specs/
│       └── v2-redesign/
│           └── requirements.md       # THIS FILE
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── pr.yml
│   │   ├── npm.yml
│   │   ├── security.yml
│   │   ├── dependabot-auto-merge.yml
│   │   └── dependabot-post-update.yml
│   └── dependabot.yml
│
├── package.json
├── lefthook.yml                      # Git hooks for THIS repo
├── biome.json
├── tsdown.config.ts                  # Build the CLI
├── tsconfig.json
├── vitest.config.ts
├── bonvoy.config.ts                  # Release config
├── .editorconfig
├── .npmpackagejsonlintrc.json
├── .lockfile-lintrc.json
├── .gitignore
├── LICENSE
├── CHANGELOG.md
└── README.md
```

---

## 4. Technology Decisions

### 4.1 Git Hooks: Lefthook (replaces Husky + lint-staged)

**Decision**: Use lefthook instead of husky + lint-staged.

**Rationale**:
- Lefthook is a single Go binary — faster than husky (shell + node)
- Has built-in staging support (`stage_fixed: true`) — eliminates lint-staged dependency
- Supports parallel/piped execution natively
- Supports glob filtering per command
- Single `lefthook.yml` config file instead of `.husky/` directory + `.lintstagedrc`
- Already used successfully in drop-coop

**Config** (`lefthook.yml`):
```yaml
pre-commit:
  piped: true
  commands:
    biome:
      glob: "*.{ts,json,yaml,md,css,html}"
      run: npx biome check --write --no-errors-on-unmatched --files-ignore-unknown=true {staged_files}
      stage_fixed: true
      priority: 1
    lockfile:
      glob: "package-lock.json"
      run: npx lockfile-lint
      priority: 1
    package-lint:
      glob: "package.json"
      run: npx npmPkgJsonLint .
      priority: 1
    package-sort:
      glob: "package.json"
      run: npx sort-package-json "package.json"
      stage_fixed: true
      priority: 1
    build:
      glob: "*.ts"
      run: npm run build
      priority: 2
    typecheck:
      glob: "*.ts"
      run: tsc --noEmit
      priority: 3
    test:
      glob: "*.ts"
      run: npx vitest run --reporter=dot
      priority: 3

commit-msg:
  commands:
    commitlint:
      run: npx --no -- commitlint --edit {1}
```

### 4.2 Commit Validation: Commitlint

**Decision**: Add commitlint with `@commitlint/config-conventional`.

**Rationale**: All other repos (FlowRAG, bonvoy, drop-coop, utils) already use it. Dev was the only one missing it.

### 4.3 Linter/Formatter: Biome (with eye on Oxc)

**Decision**: Stay on Biome today. Monitor Oxc (oxlint + oxfmt) for future migration.

**Rationale**:
- Biome is stable and mature
- Oxfmt is in beta (Feb 2026), oxlint has type-aware linting in preview
- Oxc is Prettier-compatible (Biome is not) and 3x faster than Biome
- When Oxc reaches stable, evaluate migration
- Note in README: "Biome today, Oxc when stable"

**Base biome.json** (golden config — identical core across all repos):
```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.7/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "ignoreUnknown": false },
  "formatter": { "enabled": true, "useEditorconfig": true, "lineWidth": 100 },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": { "noUnknownAtRules": "off" }
    },
    "domains": { "test": "recommended" }
  },
  "javascript": { "formatter": { "quoteStyle": "single" } },
  "assist": {
    "enabled": true,
    "actions": {
      "source": {
        "organizeImports": {
          "level": "on",
          "options": {
            "groups": [
              ":URL:", ":BLANK_LINE:",
              [":BUN:", ":NODE:"], ":BLANK_LINE:",
              [":PACKAGE_WITH_PROTOCOL:", ":PACKAGE:"], ":BLANK_LINE:",
              ":ALIAS:", ":BLANK_LINE:",
              ":PATH:"
            ]
          }
        }
      }
    }
  }
}
```

Projects may add overrides for:
- `files.includes` — exclude project-specific files (e.g., `!**/*.svelte`, `!**/components/ui`)
- `css.parser` — enable `tailwindDirectives: true` for Tailwind projects

### 4.4 Package.json Lint: npmpackagejsonlint

**Decision**: Use the inline config from FlowRAG/bonvoy/drop-coop/utils (NOT the `extends` approach from current dev).

**Rationale**: The inline config is identical across 4 repos and more explicit than the `extends` approach.

### 4.5 Lockfile Lint

**Decision**: Always include. Config is identical across all repos.

```json
{
  "path": "package-lock.json",
  "type": "npm",
  "validate-https": true,
  "allowed-hosts": ["npm"]
}
```

### 4.6 Other Lint Tools

| Tool | Include? | When |
|------|----------|------|
| `ls-engines` | Always | Validates deps respect `engines` field |
| `publint` | Only libraries | Validates npm publish correctness |
| `sort-package-json` | Always | Keeps package.json keys ordered |

### 4.7 Build: tsdown (replaces tsc)

**Decision**: Use tsdown for building the CLI (and as the recommended build tool for all projects).

**Rationale**:
- Already used in FlowRAG, bonvoy, utils
- Faster than tsc, generates `.mjs` + `.d.ts` + sourcemaps
- Workspace mode for monorepos
- Has publint/attw integration built-in
- tsc is only used for type-checking (`tsc --noEmit`)

**Base tsdown.config.ts**:
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  workspace: true,
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: true,
  exports: true,
  publint: 'ci-only',
  attw: { enabled: 'ci-only', profile: 'esm-only' },
});
```

### 4.8 TypeScript: @tsconfig/node22

**Decision**: Use `@tsconfig/node22` as the base.

**Rationale**:
- Node 22 is current LTS — safe everywhere
- node24 adds `ESNext.Error` and `ESNext.Promise` + `target: es2024` but is not LTS yet
- Projects that need node24 can override in their tsconfig
- For the company repo, the choice will depend on their Node version standard

**Base tsconfig.json** (golden config for target projects):
```json
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "noEmit": true,
    "isolatedDeclarations": true,
    "allowImportingTsExtensions": true
  }
}
```

Note: This repo's own tsconfig omits `isolatedDeclarations` and `allowImportingTsExtensions` since it's a CLI tool, not a library.

### 4.9 Testing: Vitest with v8 coverage

**Decision**: Vitest with v8 coverage provider, standard reporter config.

**Base vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary'],
      include: ['packages/**/src/**/*.ts'],  // or 'cli/**/*.ts' for single-package
      exclude: [
        '**/src/index.ts',   // Barrel re-exports
        '**/src/types.ts',   // Type declarations
      ],
    },
  },
});
```

### 4.10 Release: bonvoy (replaces semantic-release)

**Decision**: Use bonvoy for releases. Dogfooding.

**Rationale**: bonvoy is Zweer's own release tool, built specifically for this ecosystem. Using semantic-release in the dev repo while all other repos use bonvoy is inconsistent.

### 4.11 GitHub Actions: Latest versions, copy-paste distribution

**Decision**:
- Always use latest major versions of actions (e.g., `actions/checkout@v6`, `actions/setup-node@v6`)
- Distribute workflows via copy-paste (not reusable workflows)

**Rationale for copy-paste**: Reusable workflows have limitations (can't customize steps, must pass secrets explicitly, source repo must be public or same org). Copy-paste gives full control and projects can modify.

**Workflow categories**:
- **Base** (always): ci.yml, pr.yml, security.yml, dependabot-auto-merge.yml, dependabot-post-update.yml
- **Library** (npm publish): npm.yml
- **Docs** (VitePress): docs.yml

### 4.12 Config Distribution: Copy (not extends)

**Decision**: The CLI copies config files to the target project. No `extends` from npm package.

**Rationale**: Biome, lefthook, vitest, tsdown don't support extending from npm packages reliably. Copy is pragmatic and gives the project full ownership of its config.

---

## 5. Kiro Configuration Design

### 5.1 Philosophy: "Use Kiro to configure Kiro"

Instead of a CLI wizard with checkboxes, we use a specialized Kiro agent (`zweer-setup`) that:
1. Reads the project (package.json, directory structure, README, existing configs)
2. Has a conversation with the user to understand the project
3. Generates the optimal `.kiro/` configuration using templates and examples from its skills

The CLI command `dev init-kiro` installs the `zweer-setup` agent globally and instructs the user to launch a Kiro session.

### 5.2 The zweer-setup Agent

**Location**: Installed globally at `~/.kiro/agents/zweer-setup.json`

**Skills** (installed at `~/.kiro/skills/zweer-dev/`):

#### agent-template skill
- `SKILL.md` — Rules for generating `.kiro/agents/dev.json` (always deny git commit/push, whitelist write paths, autoAllowReadonly on shell, etc.)
- `references/base.json` — Common agent structure
- `references/example-monorepo-library.json` — Agent for npm library (bonvoy/FlowRAG pattern)
- `references/example-webapp-vercel.json` — Agent for web app on Vercel (drop-coop pattern)

#### prompt-template skill
- `SKILL.md` — How to write a good dev prompt (structure: mission, architecture, guidelines, git rules, communication style)
- `references/example-library.md` — Prompt for library project (FlowRAG style)
- `references/example-webapp.md` — Prompt for web app (drop-coop style)

#### steering-templates skill
- `SKILL.md` — Which steering files exist, when to include/adapt each one
- `references/code-style.md` — TypeScript conventions, naming, error handling, imports
- `references/build-tooling.md` — Stack reference (tsdown, biome, lefthook, npm workspaces)
- `references/testing.md` — Vitest, coverage strategy, mocking rules, test structure
- `references/interaction.md` — How the AI agent should behave (interview before implementing, plan mode, no git commit/push, ASCII diagrams)
- `references/commit-conventions.md` — Conventional commits + gitmoji text codes

#### skill-templates skill
- `SKILL.md` — Available skills and when to include them
- `references/new-package.md` — Skill for scaffolding a new package in a monorepo

### 5.3 Skill Format (SKILL.md with references/)

Following the official Kiro convention:

```
skill-name/
├── SKILL.md              # Frontmatter (name, description) + instructions + references to files
└── references/
    ├── file1.md
    └── file2.json
```

SKILL.md format:
```markdown
---
name: skill-name
description: What this skill does. Use when [condition].
---

# Skill Title

## Instructions
...

## References
- Review `references/file1.md` for [purpose]
- Review `references/file2.json` for [purpose]
```

Kiro loads the SKILL.md metadata at startup (lazy). Full content loaded on demand. Reference files loaded only when the SKILL.md instructions direct the agent to read them.

### 5.4 Steering Files (5 generalizable files)

Extracted and generalized from bonvoy and drop-coop steering:

1. **code-style.md** — TypeScript strict mode, no `any`, explicit types, ES modules, naming conventions (camelCase/PascalCase/UPPER_SNAKE_CASE/kebab-case), code organization, error handling, async/await, minimal dependencies
2. **build-tooling.md** — tsdown for build, biome for lint/format, npm workspaces, lefthook for git hooks, dev workflow, scripts reference, VitePress for docs
3. **testing.md** — Vitest, v8 coverage, when to mock vs not, AAA pattern, test naming, test structure, PGlite for DB tests where applicable
4. **interaction.md** — Interview before implementing (for ambiguous requests), plan mode (for multi-step tasks), ASCII diagrams, context hygiene, agent never commits/pushes
5. **commit-conventions.md** — Conventional commits with gitmoji text codes (`:sparkles:` not ✨), scope from `.vscode/settings.json`, detailed body always

### 5.5 Agent Template (common structure)

All project agents share this base:
```json
{
  "name": "dev",
  "description": "Development agent for <project>",
  "prompt": "file://../prompts/dev.md",
  "resources": [
    "file://README.md",
    "file://.kiro/steering/**/*.md",
    "skill://.kiro/skills/**/SKILL.md"
  ],
  "tools": [
    "read", "write", "shell", "grep", "glob",
    "web_search", "web_fetch", "introspect", "thinking", "code"
  ],
  "allowedTools": [
    "read", "shell", "grep", "glob",
    "web_search", "web_fetch", "introspect", "thinking", "code"
  ],
  "toolsSettings": {
    "write": {
      "allowedPaths": ["__PROJECT_SPECIFIC__"]
    },
    "shell": {
      "autoAllowReadonly": true,
      "deniedCommands": [
        ".*git commit.*", ".*git push.*",
        ".*git tag .*", ".*npm publish.*"
      ]
    }
  }
}
```

---

## 6. CLI Commands

### 6.1 `dev bootstrap`

Scaffolds a new project from scratch. Programmatic (deterministic, fast, offline).

**Flow**:
1. Ask project type (monorepo / single) — or `--yes` for monorepo default
2. Ask project name, description
3. Create directory structure from template
4. Copy golden config files (biome, tsconfig, vitest, tsdown, lefthook, editorconfig, etc.)
5. Generate package.json with correct deps and scripts
6. Init git
7. Install dependencies
8. Suggest running `dev init-kiro` for AI configuration

### 6.2 `dev setup`

Adds configs to an existing project. Programmatic.

**Flow**:
1. Detect existing configs
2. Ask what to add (interactive checkboxes) — or `--yes` for everything
3. Merge/copy configs (don't overwrite existing)
4. Add missing devDependencies
5. Add missing scripts
6. Suggest running `dev init-kiro`

### 6.3 `dev init-kiro`

Installs the zweer-setup agent globally for Kiro-powered project configuration.

**Flow**:
1. Copy `zweer-setup.json` agent to `~/.kiro/agents/`
2. Copy `zweer-setup.md` prompt to `~/.kiro/prompts/`
3. Copy skills to `~/.kiro/skills/zweer-dev/`
4. Print instructions: "Launch `kiro-cli chat` and use `/agent swap zweer-setup` to configure this project"

---

## 7. Scripts Pattern (package.json)

Consolidated from FlowRAG/bonvoy/utils:

```json
{
  "scripts": {
    "build": "tsdown",
    "clean": "rimraf dist",
    "lint": "concurrently npm:lint:* --prefixColors auto",
    "lint:engines": "ls-engines",
    "lint:format": "biome check --write",
    "lint:lockfile": "lockfile-lint",
    "lint:package": "npmPkgJsonLint .",
    "lint:sort_package": "sort-package-json \"package.json\"",
    "lint:typecheck": "tsc --noEmit",
    "prepare": "lefthook install",
    "release": "bonvoy shipit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

For monorepos, add:
- `"lint:sort_package": "sort-package-json \"package.json\" \"packages/*/package.json\""`
- Pre/post hooks for build/clean around test

---

## 8. Source Repos for Content

The following repos were analyzed and their patterns extracted:

| Repo | What to extract |
|------|----------------|
| **bonvoy** | Most mature .kiro/ setup (6 steering files, 2 skills, full agent config). Best reference for steering content, plugin architecture patterns, release workflow. |
| **drop-coop** | Best .kiro/ for web apps (5 steering files including architecture diagrams). Lefthook config. Vercel deploy pattern. SvelteKit + Hono + Neon stack. |
| **FlowRAG** | Monorepo library pattern. Identical skills to bonvoy. VitePress docs with llms.txt generation. |
| **utils** | Simple monorepo with CLI packages. Good example of "minimal project using shared configs". |
| **echoes-io/resonance** | Only repo using correct SKILL.md format with frontmatter YAML for lazy loading. Reference for skill structure. |
| **aws-infra** | Basic CDK stack. Minimal patterns — CDK best practices will need to be built from scratch for company repo. |
| **kaze-no-manga** | Multi-service architecture (backend, database, scraper, mobile, web, telegram-bot). Pattern for complex project organization. |

---

## 9. Migration Plan

### Phase 1: Clean up
1. Remove `agents/` directory (30 CAO agent files)
2. Remove `.amazonq/` directory
3. Remove `.husky/` directory and `.lintstagedrc`
4. Remove `cli/commands/cao/` and related utils/tests
5. Remove `templates/` (CAO orchestrator templates)
6. Remove `coverage/` from git (add to .gitignore)
7. Remove semantic-release config and deps from package.json

### Phase 2: New stack setup
1. Create `lefthook.yml`
2. Update `biome.json` to latest schema + align with other repos
3. Update `tsconfig.json` with new options
4. Update `vitest.config.ts` with coverage config
5. Create `tsdown.config.ts`
6. Create `bonvoy.config.ts`
7. Create `.lockfile-lintrc.json`
8. Update `.npmpackagejsonlintrc.json` to inline config
9. Add commitlint config
10. Update `package.json` (deps, scripts, remove semantic-release)
11. Update `.github/workflows/` (latest action versions, bonvoy release)

### Phase 3: Create golden configs
1. Create `configs/` directory with all golden config files
2. These are the files that `dev bootstrap` and `dev setup` will copy to target projects

### Phase 4: Create Kiro configurations
1. Create `kiro/agents/zweer-setup.json`
2. Create `kiro/prompts/zweer-setup.md`
3. Create `kiro/steering/` with 5 steering files
4. Create `kiro/skills/` with 4 skills (agent-template, prompt-template, steering-templates, skill-templates), each with SKILL.md + references/

### Phase 5: Create workflows
1. Create `workflows/base/` with ci.yml, pr.yml, security.yml, dependabot-auto-merge.yml
2. Create `workflows/library/npm.yml`
3. Create `workflows/docs/docs.yml`

### Phase 6: Update CLI
1. Remove CAO commands
2. Add `dev init-kiro` command
3. Update `dev bootstrap` to use new configs + suggest init-kiro
4. Update `dev setup` to use new configs + suggest init-kiro

### Phase 7: Create .kiro/ for this repo
1. Create `.kiro/agents/dev.json` for developing @zweer/dev itself
2. Create `.kiro/prompts/dev.md`
3. Create `.kiro/steering/` with steering files
4. Keep `.kiro/specs/v2-redesign/requirements.md` (this file)

### Phase 8: Documentation
1. Rewrite README.md
2. Update CHANGELOG.md

---

## 10. Open Questions / Future Work

1. **Company repo**: When forked, will need additional steering for CDK, corporate pipeline, review process, security policies
2. **Oxc migration**: Monitor oxfmt beta → stable and oxlint type-aware linting. When both stable, evaluate migration from Biome
3. **Additional skills**: As patterns emerge from new projects, add more skills (e.g., scaffold-api-route, scaffold-cdk-stack, scaffold-component)
4. **Templates**: The `templates/monorepo/` and `templates/single/` directories need to be populated with actual scaffold files
5. **Testing the setup agent**: The zweer-setup agent should be tested on a fresh project to validate the flow
