# @zweer/dev

Shared configurations, golden configs & Kiro AI templates for software projects.

## What's Inside

| Directory | Purpose |
|-----------|---------|
| `cli/` | CLI tool (`dev bootstrap`, `dev setup`, `dev init-kiro`) |
| `configs/` | Golden config files copied to target projects |
| `kiro/` | Kiro agent, prompt, steering & skill templates |
| `workflows/` | GitHub Actions workflow templates |

## Quick Start

### New project

```bash
npx @zweer/dev bootstrap my-project
cd my-project
npx @zweer/dev init-kiro
```

### Existing project

```bash
npx @zweer/dev setup
npx @zweer/dev init-kiro
```

## CLI Commands

### `dev bootstrap [name]`

Scaffolds a new project with all golden configs, scripts, and dependencies.

### `dev setup`

Adds golden configs to an existing project. Merges deps and scripts into `package.json`, copies config files (won't overwrite existing), installs base GitHub Actions workflows.

### `dev init-kiro`

Installs the `zweer-setup` agent globally for Kiro-powered project configuration. After running, launch `kiro-cli chat` and use `/agent swap zweer-setup` to configure the project.

## Golden Configs

All projects get these configs (via `dev bootstrap` or `dev setup`):

| Config | Tool |
|--------|------|
| `biome.json` | Biome (linter + formatter) |
| `tsconfig.json` | TypeScript (`@tsconfig/node22`) |
| `tsdown.config.ts` | tsdown (build) |
| `vitest.config.ts` | Vitest (testing + v8 coverage) |
| `lefthook.yml` | Lefthook (git hooks) |
| `commitlint.config.ts` | Commitlint (conventional commits) |
| `.editorconfig` | EditorConfig |
| `.lockfile-lintrc.json` | Lockfile-lint (security) |
| `.npmpackagejsonlintrc.json` | npm-package-json-lint |

## Project Templates

`dev bootstrap` uses these templates:

| Template | Use case | Example repos |
|----------|----------|---------------|
| `single` (default) | Single npm package | utils (if single-pkg) |
| `monorepo` | npm workspaces with `packages/*` | bonvoy, FlowRAG, utils |

For web apps (Next.js, SvelteKit, etc.), use the framework's own scaffolding tool first, then run `dev setup` to add golden configs.

## Kiro Templates

The `zweer-setup` agent generates `.kiro/` config for any project:

- **5+ steering files**: code-style, build-tooling, testing, interaction, commit-conventions (+ web-nextjs, web-deploy for web apps)
- **Agent config**: Tailored `dev.json` with project-specific write paths
- **Prompt**: Project-specific system prompt
- **Skills**: Monorepo scaffolding, workflow skills, spec templates

### Workflow Skills

Trigger these in chat to switch the agent's cognitive mode:

| Trigger | Mode | Use when |
|---------|------|----------|
| `plan product` | Product Owner | Starting a feature, vague requirements |
| `plan eng` | Tech Lead | Architecture, failure modes, test matrix |
| `code review` | Paranoid Reviewer | After implementation, before committing |
| `qa` | QA Lead | Verify changes, health score |
| `ship prep` | Release Engineer | Build/lint/test checklist + commit message |
| `retro` | Engineering Manager | Analyze what happened (git history) |
| `new spec` | Spec Author | Create structured spec from template |

Typical flow: `plan product` → `plan eng` → implement → `code review` → `qa` → `ship prep`

### Hooks

| Hook | Trigger | What it does |
|------|---------|-------------|
| `safety-gate` | `preToolUse` | Blocks git commit/push, npm publish, destructive ops |
| `barrel-export` | `fileCreated` | Auto-updates barrel index.ts in monorepo packages |
| `context-injection` | `fileEdited` | Loads relevant steering doc based on file type |
| `post-task-summary` | `agentStop` | Summarizes changes + suggests commit message |

## Workflow Templates

| Tier | Workflows | When |
|------|-----------|------|
| Base | ci, pr, security, dependabot-auto-merge, dependabot-post-update | Always |
| Library | npm release | npm packages |
| Docs | VitePress deploy | Projects with docs/ |

## Stack Decisions

- **Biome** today, Oxc when stable
- **Lefthook** (not husky + lint-staged)
- **tsdown** (not tsc for build)
- **bonvoy** (not semantic-release)
- **@tsconfig/node22** (LTS)
- **Copy** config distribution (not extends)

## Development

```bash
npm install
npm run build
npm test
npm run lint
```

## License

MIT
