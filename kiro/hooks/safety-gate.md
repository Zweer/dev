---
name: safety-gate
description: Block dangerous shell commands before execution.
trigger: preToolUse
toolName: shell
---

# Safety Gate

Before executing any shell command, verify it does NOT:

1. **Commit or push**: `git commit`, `git push`, `git tag`
2. **Publish**: `npm publish`, `npx bonvoy shipit`
3. **Destructive ops**: `rm -rf /`, `rm -rf ~`, `rm -rf .git`
4. **Credential access**: `cat ~/.ssh`, `cat ~/.aws`, `printenv | grep SECRET`

If the command matches any of these patterns:
- **BLOCK** the command
- Explain why it was blocked
- Suggest the safe alternative (e.g., "prepare the commit message and I'll commit manually")
