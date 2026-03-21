---
name: agent-template
description: Generate .kiro/agents/dev.json for a project. Use when setting up a new project's Kiro agent configuration.
---

# Agent Template

Generate a `.kiro/agents/dev.json` file tailored to the project.

## Rules

1. Always deny `git commit`, `git push`, `git tag`, `npm publish` in shell
2. Set `autoAllowReadonly: true` on shell
3. `allowedTools` should include everything EXCEPT `write` (write needs approval)
4. `write.allowedPaths` should be project-specific (source dirs, configs, .kiro)
5. Prompt should reference `file://../prompts/dev.md`
6. Resources should include README, steering, and skills

## References
- Review `references/base.json` for the common agent structure
- Review `references/example-monorepo-library.json` for npm library projects
- Review `references/example-webapp-vercel.json` for web app projects
