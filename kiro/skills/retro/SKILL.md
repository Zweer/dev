---
name: retro
description: "Engineering retrospective — analyze commits, LOC, test ratio, hotspots. Data-driven, not vibes."
---

# Retro

**Cognitive mode: Engineering Manager**

Understand what actually happened. Not vibes — data.

## Trigger

Invoke with: `retro`, `retrospective`, or `what happened`

## Workflow

### 1. Gather Data

```bash
git log --oneline --since="1 week ago" --all
git log --stat --since="1 week ago" --all
git shortlog -sn --since="1 week ago" --all
git log --since="1 week ago" --all --name-only --pretty=format: | sort | uniq -c | sort -rn | head -20
```

### 2. Analyze

- Total commits, LOC added/removed
- Test ratio (test files vs source files changed)
- Hotspot files (most frequently changed)
- Biggest ship of the period

### 3. Reflect

**What went well:** correct decisions, reusable patterns
**What needs improvement:** mistakes + root cause, wasted time
**Surprises:** unexpected issues, platform quirks

### 4. Action Items

- 3 things to do differently
- 3 habits to maintain

## Output Format

```markdown
# Retro: {date range}

## Stats
- Commits: {N} | LOC: +{N} -{N} | Test ratio: {N}%
- Hotspots: {top 3 files}
- Biggest ship: {description}

## What Went Well
1. {win}
2. {win}

## What Needs Improvement
1. {issue} — Root cause: {why} — Fix: {action}
2. {issue} — Root cause: {why} — Fix: {action}

## Action Items
### Do Differently
1. {action}

### Keep Doing
1. {habit}
```

## Principles
- Be candid, not cruel
- Root causes matter more than symptoms
- If there's nothing to improve, you're not looking hard enough
