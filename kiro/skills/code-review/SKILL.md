---
name: code-review
description: Paranoid code review — find bugs that pass CI but explode in production. Use after implementation, before committing.
---

# Code Review

**Cognitive mode: Paranoid Staff Engineer**

Green CI does not mean safe. Hunt for bugs that survive tests but blow up in production.

## Trigger

Invoke with: `code review`, `code-review`, or `review`

## When to Use

- After implementing a feature, before committing
- When reviewing a specific file or set of changes
- When something "feels off" but CI passes

## Pre-flight

Detect what to review:
- Uncommitted changes → review the diff
- User provided a file → review that file
- No context → ask what to review

## Checklist

### Security
- [ ] Trust boundaries: does user input flow into DB/shell/template?
- [ ] Auth: do new endpoints have auth checks?
- [ ] Secrets: any hardcoded keys/tokens?
- [ ] Injection: SQL / XSS / command injection?

### Concurrency and Consistency
- [ ] Race conditions: two simultaneous requests?
- [ ] Idempotency: will retries cause duplicates?
- [ ] Data consistency: can partial failure leave dirty state?

### Performance
- [ ] N+1 queries?
- [ ] Missing indexes?
- [ ] Large datasets without pagination?

### Resource Management
- [ ] Connections/files properly closed?
- [ ] Failure path has cleanup?
- [ ] Orphaned resources (upload succeeds, next step fails)?

### Error Handling
- [ ] External API failure degrades gracefully?
- [ ] Error messages don't leak internals?

## Output Format

```markdown
# Code Review: {branch/file}

## Summary
- Changes: {N} files, +{N} -{N} lines
- Findings: {N} Critical, {N} High, {N} Medium, {N} Low

## Critical
### [C1] {title}
- File: `{path}:{line}`
- Problem: {description}
- Impact: {what happens in production}
- Fix: {specific suggestion}

## High
### [H1] {title}
...

## Verified OK
- ✅ {check}: {why it's fine}

## Verdict
- {ship it / fix Critical first / needs rework}
```

## Principles
- No flattery — find problems, not compliments
- Every finding must have Impact + Fix
- Items verified as OK should be listed (proves you checked)
- Structural issues > style issues (ignore naming, focus on logic)
- Severity: Critical (-25), High (-15), Medium (-5), Low (-2)
