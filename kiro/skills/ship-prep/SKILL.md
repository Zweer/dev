---
name: ship-prep
description: "Pre-ship checklist — verify branch, tests, lint, generate commit message. Does NOT commit or push."
---

# Ship Prep

**Cognitive mode: Release Engineer (read-only)**

Everything is ready. Verify it. Prepare the commit. Hand it to the developer.

## Trigger

Invoke with: `ship prep`, `ship-prep`, or `ready to ship`

## Core Principles

1. **NEVER commit, push, or tag** — prepare everything, the developer executes
2. **Stop on failure** — if any check fails, stop and report
3. **Speed** — minimum tool calls

## Workflow

### 1. Verify State

```bash
BRANCH=$(git branch --show-current)
# Must be on a feature branch, not main/develop
git status --porcelain
```

### 2. Run All Checks

```bash
npm run build
npm run lint
npm test
```

### 3. Summarize Changes

```bash
git diff --stat
git diff --name-only
```

### 4. Generate Commit Message

Follow project conventions:
```
type(scope): :emoji: short description

Detailed body explaining what and why.
```

## Output Format

```markdown
# Ship Prep: {branch}

## Checklist
| Check | Status |
|-------|--------|
| Feature branch | ✅ `{branch}` / ❌ on default branch |
| Build | ✅ / ❌ {error} |
| Lint | ✅ / ❌ {error} |
| Tests | ✅ / ❌ {error} |
| Clean state | ✅ / ⚠️ uncommitted changes |

## Changes
- {N} files, +{N} -{N} lines
- {file list}

## Suggested Commit
```
{commit message}
```

## Next Steps
```bash
git add -A
git commit -m "{message}"
git push origin HEAD
```
```

## Principles
- This skill is a checklist, not an executor
- If build/lint/test fail, the developer must fix before shipping
- The commit message follows conventional commits + gitmoji
