# @zweer/dev - Shared Configurations & AI Agents

Central repository of reusable configurations and specialized AI agents for software projects.

## Table of Contents

- [Project Purpose](#project-purpose)
- [Structure](#structure)
- [How It Works](#how-it-works)
  - [1. Orchestrator Agent (in your project)](#1-orchestrator-agent-in-your-project)
  - [2. Specialized Agents (in this repo)](#2-specialized-agents-in-this-repo)
  - [3. Agent Handoff](#3-agent-handoff)
- [Available Agents](#available-agents)
  - [Web Development](#web-development-agentsdev)
- [How to Use Agents](#how-to-use-agents)
  - [Setup in Your Project](#setup-in-your-project)
  - [Delegation Example in Orchestrator](#delegation-example-in-orchestrator)
  - [Providing Context to Agents](#providing-context-to-agents)
- [Benefits of This Approach](#benefits-of-this-approach)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

## Project Purpose

This repository contains:

1. **Specialized AI agents** - Agent configurations for different domains (web development, writing, etc.)
2. **Common configurations** - Shared setups for linting, formatting, TypeScript, etc.
3. **Templates** - Reusable project structures

The idea is to have an **orchestrator + specialized agents pattern**:
- Each project has an **orchestrator agent** with project-specific context
- The orchestrator delegates tasks to **specialized agents** via handoff
- Specialized agents are generic and reusable across projects

## Structure

```
dev/
├── agents/                              # Specialized AI agents (30 total)
│   ├── data/                           # Data engineering (1)
│   │   └── zweer_data_engineer.md
│   ├── design/                         # UI/UX (2)
│   │   ├── zweer_ui_designer.md
│   │   └── zweer_ui_ux.md
│   ├── infrastructure/                 # Platform & IaC (4)
│   │   ├── zweer_infra_cdk.md
│   │   ├── zweer_infra_devops.md
│   │   ├── zweer_infra_observability.md
│   │   └── zweer_infra_terraform.md
│   ├── mobile/                         # Mobile development (5)
│   │   ├── zweer_mobile_android.md
│   │   ├── zweer_mobile_flutter.md
│   │   ├── zweer_mobile_ionic.md
│   │   ├── zweer_mobile_ios.md
│   │   └── zweer_mobile_react_native.md
│   ├── quality/                        # Quality & best practices (4)
│   │   ├── zweer_qa_documentation.md
│   │   ├── zweer_qa_performance.md
│   │   ├── zweer_qa_security.md
│   │   └── zweer_qa_testing.md
│   ├── services/                       # Backend services (5)
│   │   ├── zweer_svc_api_gateway.md
│   │   ├── zweer_svc_containers.md
│   │   ├── zweer_svc_lambda.md
│   │   ├── zweer_svc_messaging.md
│   │   └── zweer_svc_microservices.md
│   ├── web/                            # Web full-stack (5)
│   │   ├── zweer_web_api_integration.md
│   │   ├── zweer_web_backend.md
│   │   ├── zweer_web_database.md
│   │   ├── zweer_web_frontend.md
│   │   └── zweer_web_reader.md
│   └── write/                          # Content & creative writing (4)
│       ├── zweer_write_content.md
│       ├── zweer_write_narrative.md
│       ├── zweer_write_style.md
│       └── zweer_write_warmth.md
├── cli/                                # CLI tool implementation
├── templates/                          # Project templates
└── README.md                          # This file
```

All agents follow the naming convention: `zweer_<category>_<name>` for global uniqueness.

## How It Works

### 1. Orchestrator Agent (in your project)

The orchestrator is project-specific and contains:
- **Project context**: name, purpose, tech stack, architecture
- **Documentation**: references to README, ARCHITECTURE, DATABASE_SCHEMA, etc.
- **Delegation logic**: which agent to call for which task
- **Project standards**: code conventions, design system, best practices

Example orchestrator structure:

```yaml
---
name: my_project_orchestrator
description: Project orchestrator for My Project
model: claude-sonnet-4.5
mcpServers:
  cao-mcp-server:
    type: stdio
    command: uvx
    args:
      - "--from"
      - "git+https://github.com/awslabs/cli-agent-orchestrator.git@main"
      - "cao-mcp-server"
tools: ["*"]
allowedTools: ["fs_read", "fs_write", "execute_bash", "@cao-mcp-server"]
---

# My Project - Orchestrator

## Project Context
- Name: My Project
- Tech Stack: Next.js, TypeScript, PostgreSQL
- [Project-specific details]

## Instructions
[Orchestration and delegation logic]
```

### 2. Specialized Agents (in this repo)

Specialized agents are **generic** and **reusable**. They don't know about your specific project, but are experts in a domain.

Each agent has:
- **Specific expertise**: e.g. React, database design, security
- **Best practices**: guidelines for the domain
- **Examples**: common patterns and solutions

### 3. Agent Handoff

The orchestrator delegates tasks to agents via the `@cao-mcp-server` tool:

```
Orchestrator receives: "Create login page"
  ↓
Orchestrator analyzes and plans:
  1. UX design → delegate to dev_ux
  2. UI components → delegate to dev_frontend
  3. Authentication → delegate to dev_backend
  4. DB schema → delegate to dev_database
  ↓
Orchestrator coordinates execution and validates results
```

## Available Agents

All agents use the `zweer_<category>_<name>` naming convention for global uniqueness.

### Web Development (`agents/web/`)

- **zweer_web_frontend** - React, Next.js, components, client-side logic
- **zweer_web_backend** - API routes, Server Actions, business logic
- **zweer_web_database** - Schema design, queries, migrations
- **zweer_web_api_integration** - External API integrations, scrapers
- **zweer_web_reader** - Image viewer, document reader, gestures

### Services (`agents/services/`)

- **zweer_svc_lambda** - AWS Lambda, serverless functions, event handlers
- **zweer_svc_microservices** - Service design, communication patterns, distributed systems
- **zweer_svc_api_gateway** - REST, GraphQL, API Gateway, rate limiting
- **zweer_svc_messaging** - SQS, SNS, EventBridge, event-driven architecture
- **zweer_svc_containers** - Docker, ECS, EKS, container orchestration

### Infrastructure (`agents/infrastructure/`)

- **zweer_infra_cdk** - AWS CDK with TypeScript, stacks, constructs
- **zweer_infra_terraform** - Terraform HCL, modules, state management
- **zweer_infra_devops** - Deploy, CI/CD, infrastructure
- **zweer_infra_observability** - Monitoring, logging, tracing, alerting

### Design (`agents/design/`)

- **zweer_ui_designer** - UI components, design system, styling
- **zweer_ui_ux** - User flows, accessibility, mobile experience

### Mobile (`agents/mobile/`)

- **zweer_mobile_react_native** - Cross-platform mobile with React Native
- **zweer_mobile_ionic** - Hybrid mobile apps with Capacitor
- **zweer_mobile_flutter** - Cross-platform mobile with Dart
- **zweer_mobile_ios** - Native iOS with Swift, SwiftUI, UIKit
- **zweer_mobile_android** - Native Android with Kotlin, Jetpack Compose

### Quality (`agents/quality/`)

- **zweer_qa_testing** - Unit, integration, E2E tests
- **zweer_qa_security** - Auth, security, vulnerabilities
- **zweer_qa_performance** - Optimization, caching, monitoring
- **zweer_qa_documentation** - Technical writing, API docs

### Data Engineering (`agents/data/`)

- **zweer_data_engineer** - ETL pipelines, data warehousing, analytics

### Writing (`agents/write/`)

- **zweer_write_content** - Blog posts, articles, marketing copy
- **zweer_write_narrative** - Creative fiction, storytelling, character development
- **zweer_write_style** - Refine writing quality, remove AI patterns, improve flow
- **zweer_write_warmth** - Add human warmth, empathy, and emotional connection

## CLI Tool

Command-line tool for managing AI agents, orchestrators, and project configurations.

### Installation

```bash
npm install -g @zweer/dev
```

Or use with npx:

```bash
npx @zweer/dev <command>
```

### Commands

#### Project Setup

##### `dev bootstrap`

Bootstrap a new npm package with standard configuration.

```bash
# Interactive mode
dev bootstrap

# Skip prompts (use defaults)
dev bootstrap --yes
```

Creates a complete project structure with:
- `package.json` with all dependencies and scripts
- TypeScript configuration (`tsconfig.json`)
- Biome linter/formatter (`biome.json`)
- Vitest testing setup (`vitest.config.ts`)
- Git hooks with Husky and lint-staged
- EditorConfig (`.editorconfig`)
- Sample source and test files
- README template

**Options:**
- `-y, --yes` - Skip prompts and use defaults

##### `dev setup`

Add standard configuration to an existing project.

```bash
# Interactive mode - choose what to add
dev setup

# Add everything
dev setup --yes
```

Adds configurations to existing project:
- Merges dependencies into existing `package.json` (doesn't overwrite)
- Merges scripts into existing `package.json`
- Creates missing config files (tsconfig, biome, vitest, etc.)
- Skips files that already exist
- Preserves existing values

**Options:**
- `-y, --yes` - Skip prompts and add all configurations

#### AI Agents (CAO)

All CAO-related commands are under the `cao` subcommand:

##### `dev cao install`

Install CAO (CLI Agent Orchestrator) and all global agents.

```bash
# Install everything
dev cao install

# Install only CAO
dev cao install --cao-only

# Install only agents
dev cao install --agents-only
```

This command:
1. Installs tmux configuration
2. Installs `uv` package manager
3. Installs CAO via `uv tool install`
4. Installs all 30+ global agents (zweer_*) from this repository

**Options:**
- `--cao-only` - Install only CAO prerequisites
- `--agents-only` - Install only agents (skip CAO)

##### `dev cao agent create [name]`

Create a new local agent in your project.

```bash
# Interactive mode
dev cao agent create

# With custom name
dev cao agent create my_orchestrator

# With template
dev cao agent create db_specialist --template specialist

# Skip prompts (use defaults)
dev cao agent create my_agent --yes
```

Creates `.cao/agents/<name>.md` with a template agent configured for your project.

**Options:**
- `-t, --template <template>` - Template to use (orchestrator, specialist)
- `-y, --yes` - Skip prompts and use defaults

##### `dev cao agent list`

List all local agents in `.cao/agents/`.

```bash
dev cao agent list
```

##### `dev cao agent remove <name>`

Remove a local agent.

```bash
# With confirmation prompt
dev cao agent remove my_agent

# Skip confirmation
dev cao agent remove my_agent --yes
```

**Options:**
- `-y, --yes` - Skip confirmation

##### `dev cao sync`

Sync (install/update) all local agents from `.cao/agents/`.

```bash
dev cao sync
```

Run this after creating or modifying local agents to install/update them in CAO.

##### `dev cao server`

Launch the CAO server.

```bash
dev cao server
```

Starts `cao-server` which enables agent communication and handoff.

##### `dev cao launch <agent>`

Launch a specific agent.

```bash
# Launch your orchestrator
dev cao launch my_project_orchestrator

# Launch a specialized agent
dev cao launch zweer_web_frontend
```

##### `dev cao list`

List all available agents with descriptions.

```bash
# List all agents with installation status
dev cao list

# List only installed agents
dev cao list --installed
```

Shows all 30+ agents organized by category with installation status indicators:
- ✓ = Installed
- ○ = Not installed

**Options:**
- `--installed` - Show only installed agents

##### `dev cao status`

Show installation status summary.

```bash
dev cao status
```

Displays:
- Number of installed agents
- Number of not installed agents
- List of agents that are not installed

##### `dev cao uninstall <agent>`

Uninstall a specific agent.

```bash
dev cao uninstall zweer_web_frontend
```

Removes the agent from CAO's agent directory (`~/.aws/cli-agent-orchestrator/agent-context/`).

## How to Use Agents

### Setup in Your Project

```bash
# In your project directory
cd my-project

# Install CAO and global agents (zweer_*)
dev cao install

# Create orchestrator
dev cao agent create my_orchestrator

# Create specialized agents for your project
dev cao agent create db_specialist --template specialist
dev cao agent create api_expert --template specialist

# Sync all local agents
dev cao sync
```

### Customize Agents

Edit agents in `.cao/agents/` to add:
- Project-specific context
- Tech stack details
- Architecture notes
- Custom logic and tools

After editing, run `dev cao sync` to update them in CAO.

### Launch and Work

```bash
# Start CAO server (in one terminal)
dev cao server

# Launch your orchestrator (in another terminal)
dev cao launch my_orchestrator

# Or launch a specialized agent
dev cao launch db_specialist
```

### Managing Local Agents

```bash
# List all local agents
dev cao agent list

# Remove an agent
dev cao agent remove old_agent

# Sync after modifications
dev cao sync
```

### Use Agent Handoff

In your orchestrator, delegate to specialized agents:

```typescript
handoff({
  agent: "zweer_web_frontend",
  context: {
    task: "Create login page component",
    requirements: {
      framework: "Next.js 15",
      styling: "Tailwind CSS",
      validation: "Zod"
    }
  }
})
```

### Delegation Example in Orchestrator

```markdown
### Agent Selection Guide

**For UI/UX Tasks**:
- `zweer_ui_ux` → User flows, accessibility, mobile experience
- `zweer_ui_designer` → Components, styling, design system
- `zweer_web_frontend` → React components, pages, client logic

**For Backend Tasks**:
- `zweer_web_backend` → API routes, Server Actions, business logic
- `zweer_web_database` → Schema design, queries, migrations
- `zweer_web_api_integration` → External integrations

**For Quality Tasks**:
- `zweer_qa_testing` → Automated tests
- `zweer_qa_security` → Security and auth
- `zweer_qa_performance` → Optimizations

### Task Breakdown Example

**User**: "Create login page"

**Orchestrator**:
1. `zweer_ui_ux` → Design authentication flow
2. `zweer_ui_designer` → Form components and UI
3. `zweer_web_backend` → Setup Auth.js and session management
4. `zweer_web_database` → Users table and queries
5. `zweer_qa_security` → CSRF protection and validation
6. `zweer_qa_testing` → Test complete flow
```

### Providing Context to Agents

When the orchestrator delegates to an agent, it must provide:

```markdown
**Project Context**:
- Name: My Project
- Tech Stack: Next.js 15, TypeScript, Drizzle ORM, Neon Postgres
- Design: Dark mode, blue theme, mobile-first
- Architecture: App Router, Server Components, Server Actions

**Specific Task**:
[Detailed task description]

**Constraints**:
- Use TypeScript strict mode
- Follow project conventions (see ARCHITECTURE.md)
- Minimal code, only what's needed
```

## Benefits of This Approach

1. **Reusability**: Specialized agents work for any project
2. **Separation**: Project context (orchestrator) vs generic expertise (agents)
3. **Maintainability**: Agent updates propagate to all projects
4. **Modularity**: Each agent is expert in a specific domain
5. **Scalability**: Easy to add new agents or domains

## Contributing

To add new agents:

1. Identify the domain (e.g. `agents/data/`, `agents/mobile/`)
2. Create appropriate folder structure
3. Write the agent in `.md` format with:
   - YAML frontmatter (name, description, model, tools)
   - Expertise description
   - Best practices
   - Code examples

## Roadmap

- [x] Services agents (`agents/services/`)
  - [x] Lambda development
  - [x] Microservices architecture
  - [x] API Gateway & REST/GraphQL
  - [x] Messaging (SQS, SNS, EventBridge)
  - [x] Container orchestration (ECS, EKS)
- [x] Infrastructure agents (`agents/infrastructure/`)
  - [x] AWS CDK
  - [x] Terraform
  - [x] Observability (monitoring, logging)
- [x] Mobile agents (`agents/mobile/`)
  - [x] React Native
  - [x] Ionic
  - [x] Flutter
  - [x] iOS native
  - [x] Android native
- [x] Data engineering agents (`agents/data/`)
- [x] Writing agents (`agents/writing/`)
- [ ] Common configurations (`configs/`)
- [ ] Project templates (`templates/`)
- [ ] Orchestrator examples

## License

MIT
