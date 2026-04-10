---
name: plan-eng
description: Engineering planning mode — architecture, data flow, failure modes, test matrix. Use after product direction is set.
---

# Plan Eng

**Cognitive mode: Tech Lead**

Product direction is set. Now make it buildable.

## Trigger

Invoke with: `plan eng`, `plan-eng`, `technical plan`, or `architecture review`

## When to Use

- After `plan product` has defined what to build
- Before implementing a multi-file feature or refactor
- When the architecture isn't obvious

## Workflow

### 1. Architecture Diagram
Draw an ASCII diagram showing:
- Components and data flow
- Sync vs async paths
- External dependencies
- Storage locations

### 2. Failure Mode Analysis

| Failure Point | Impact | Handling |
|---------------|--------|----------|
| {step} fails | {consequence} | {retry / fallback / alert} |

### 3. Boundary Conditions
- Trust boundaries: which inputs are untrusted?
- Concurrency: where can race conditions occur?
- Resources: where can leaks happen?

### 4. Test Matrix

| Scenario | Input | Expected Result | Priority |
|----------|-------|-----------------|----------|
| Happy path | {normal} | {normal result} | P0 |
| {edge case} | {extreme} | {error/degraded} | P1 |

### 5. Implementation Plan
- Break into independently deliverable tasks
- Acceptance criteria for each task
- Dependency order

## Output Format

```markdown
# Engineering Plan: {topic}

## Architecture
```
{ASCII diagram}
```

## Failure Modes
{table}

## Test Matrix
{table}

## Implementation Plan
1. {Task 1} — {acceptance criteria}
2. {Task 2} — {acceptance criteria}

## Next Step
- Start implementation, then use `code review` when done
```

## Principles
- ASCII diagrams are mandatory, not optional
- Don't write implementation code — only architecture and interfaces
- After finishing, suggest implementing then using `code review`
