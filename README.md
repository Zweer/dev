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

## Shell Setup (Starship)

Recommended prompt setup for all dev machines (bash on WSL/Ubuntu):

### Install Starship

```bash
curl -sS https://starship.rs/install.sh | sh
echo 'eval "$(starship init bash)"' >> ~/.bashrc
```

### Install a Nerd Font

On **Windows**: download a Nerd Font (e.g. JetBrainsMono) from https://www.nerdfonts.com/font-downloads, install it, then set it as the font in Windows Terminal settings.

### Config (`~/.config/starship.toml`)

```toml
format = """
$directory\
$git_branch\
$git_status\
$nodejs\
$custom\
$cmd_duration\
$status\
$line_break\
$character"""

[directory]
truncation_length = 0
truncate_to_repo = false

[git_branch]
format = "[$branch]($style) "
style = "purple"

[git_status]
format = "[$all_status$ahead_behind]($style) "
style = "red"

[nodejs]
format = "[node $version]($style) "
style = "green"

[custom.gh]
command = "grep -A20 'github.com:' ${GH_CONFIG_DIR:-$HOME/.config/gh}/hosts.yml 2>/dev/null | grep '^\\s*user:' | head -1 | awk '{print $2}'"
when = true
format = "[gh:$output]($style) "
style = "cyan"

[cmd_duration]
min_time = 2000
format = "[took $duration]($style) "
style = "yellow"

[status]
disabled = false
format = "[$status]($style) "
style = "red"

[character]
success_symbol = "[❯](green)"
error_symbol = "[❯](red)"
```

### What it shows

| Module | Info |
|--------|------|
| `directory` | Full working directory path |
| `git_branch` | Current branch |
| `git_status` | Dirty/clean, ahead/behind |
| `nodejs` | Active Node.js version (via nvm) |
| `custom.gh` | Active GitHub account (from `gh` config) |
| `cmd_duration` | Execution time (if > 2s) |
| `status` | Exit code on error |

## Development

```bash
npm install
npm run build
npm test
npm run lint
```

## License

MIT
