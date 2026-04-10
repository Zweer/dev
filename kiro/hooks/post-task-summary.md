---
name: post-task-summary
description: Summarize changes and suggest a commit message when the agent finishes a task.
trigger: agentStop
---

# Post-Task Summary

When finishing a task, provide:

1. **Changed files** — list of files created, modified, or deleted
2. **What changed** — one-sentence summary of the change
3. **Suggested commit message** — following the project's commit conventions:
   ```
   type(scope): :emoji: short description

   Detailed body explaining what and why.
   ```

Do NOT actually commit. The developer handles all git operations manually.
