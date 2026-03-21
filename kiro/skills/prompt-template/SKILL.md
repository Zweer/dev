---
name: prompt-template
description: Generate .kiro/prompts/dev.md for a project. Use when creating the agent's system prompt.
---

# Prompt Template

Generate a `.kiro/prompts/dev.md` file tailored to the project.

## Structure

Every prompt should have these sections:
1. **Title & Role** — "You are the __NAME__ Development Agent"
2. **Project Mission** — What the project does, in 2-3 sentences
3. **Project Knowledge** — Which specs/docs to always reference
4. **Architecture Overview** — Tech stack, structure, design principles
5. **Development Guidelines** — TypeScript style, testing, code quality
6. **Git Rules** — NEVER commit/push, suggest commit messages
7. **Communication Style** — Language, tone, focus

## References
- Review `references/example-library.md` for npm library prompts
- Review `references/example-webapp.md` for web app prompts
