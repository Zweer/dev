# dev - Shared Configurations & AI Agents

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
├── agents/                    # Specialized AI agents
│   ├── web/                  # Web full-stack development
│   │   ├── frontend/         # React, Next.js, client logic
│   │   ├── backend/          # API routes, Server Actions
│   │   └── database/         # Schema, queries, migrations
│   ├── services/             # Backend services (cloud-native)
│   │   ├── lambda/           # AWS Lambda, serverless functions
│   │   ├── microservices/    # Microservices architecture
│   │   ├── api/              # API Gateway, REST, GraphQL
│   │   ├── messaging/        # SQS, SNS, EventBridge
│   │   └── containers/       # ECS, EKS, Docker
│   ├── infrastructure/       # Platform & IaC
│   │   ├── cdk/             # AWS CDK
│   │   ├── terraform/       # Terraform
│   │   ├── cicd/            # CI/CD pipelines
│   │   └── observability/   # Monitoring, logging
│   ├── design/              # UI/UX cross-device
│   │   ├── ui/              # Design systems, components
│   │   └── ux/              # User flows, accessibility
│   ├── mobile/              # Mobile development
│   │   ├── react-native/    # React Native
│   │   ├── ionic/           # Ionic
│   │   ├── flutter/         # Flutter
│   │   ├── ios/             # iOS native
│   │   └── android/         # Android native
│   ├── quality/             # Quality & best practices (cross-domain)
│   │   ├── testing/         # Unit, integration, E2E tests
│   │   ├── security/        # Security, auth, vulnerabilities
│   │   ├── performance/     # Optimization, caching, monitoring
│   │   └── documentation/   # Technical writing, API docs
│   ├── data/                # Data engineering
│   │   └── data_engineer    # ETL, data warehousing, analytics
│   └── writing/             # Content & creative writing
│       ├── content_writer   # Blog posts, articles, marketing
│       ├── narrative_writer # Fiction, storytelling, characters
│       ├── style_editor     # Remove AI patterns, improve flow
│       └── warmth_agent     # Add human warmth and empathy
├── configs/                 # Common configurations (TODO)
├── templates/               # Project templates (TODO)
└── README.md               # This file
```

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

### Web Development (`agents/web/`)

**Frontend** (`frontend/`):
- **dev_frontend** - React, Next.js, components, client-side logic
- **dev_reader** - Image viewer, document reader, gestures

**Backend** (`backend/`):
- **dev_backend** - API routes, Server Actions, business logic
- **dev_api_integration** - External API integrations, scrapers

**Database** (`database/`):
- **dev_database** - Schema design, queries, migrations

### Services (`agents/services/`)

**Lambda** (`lambda/`):
- **lambda_developer** - AWS Lambda, serverless functions, event handlers

**Microservices** (`microservices/`):
- **microservices_architect** - Service design, communication patterns, distributed systems

**API** (`api/`):
- **api_gateway_specialist** - REST, GraphQL, API Gateway, rate limiting

**Messaging** (`messaging/`):
- **messaging_specialist** - SQS, SNS, EventBridge, event-driven architecture

**Containers** (`containers/`):
- **container_specialist** - Docker, ECS, EKS, container orchestration

### Infrastructure (`agents/infrastructure/`)

**CDK** (`cdk/`):
- **cdk_developer** - AWS CDK with TypeScript, stacks, constructs

**Terraform** (`terraform/`):
- **terraform_developer** - Terraform HCL, modules, state management

**CI/CD** (`cicd/`):
- **dev_devops** - Deploy, CI/CD, infrastructure

**Observability** (`observability/`):
- **observability_specialist** - Monitoring, logging, tracing, alerting

### Design (`agents/design/`)

- **dev_ui** - UI components, design system, styling
- **dev_ux** - User flows, accessibility, mobile experience

### Mobile (`agents/mobile/`)

**React Native** (`react-native/`):
- **react_native_developer** - Cross-platform mobile with React Native

**Ionic** (`ionic/`):
- **ionic_developer** - Hybrid mobile apps with Capacitor

**Flutter** (`flutter/`):
- **flutter_developer** - Cross-platform mobile with Dart

**iOS** (`ios/`):
- **ios_developer** - Native iOS with Swift, SwiftUI, UIKit

**Android** (`android/`):
- **android_developer** - Native Android with Kotlin, Jetpack Compose

### Quality (`agents/quality/`)

**Testing** (`testing/`):
- **dev_testing** - Unit, integration, E2E tests

**Security** (`security/`):
- **dev_security** - Auth, security, vulnerabilities

**Performance** (`performance/`):
- **dev_performance** - Optimization, caching, monitoring

**Documentation** (`documentation/`):
- **dev_documentation** - Technical writing, API docs

### Data Engineering (`agents/data/`)
- **data_engineer** - ETL pipelines, data warehousing, analytics

### Writing (`agents/writing/`)
- **content_writer** - Blog posts, articles, marketing copy
- **narrative_writer** - Creative fiction, storytelling, character development
- **style_editor** - Refine writing quality, remove AI patterns, improve flow
- **warmth_agent** - Add human warmth, empathy, and emotional connection

## CLI Tool

Command-line tool for managing AI agents and orchestrators in your projects.

### Installation

```bash
npm install -g @zweer/dev
```

Or use with npx:

```bash
npx @zweer/dev <command>
```

### Commands

All CAO-related commands are under the `cao` subcommand:

#### `dev cao init [name]`

Create an orchestrator in your current project.

```bash
# Interactive mode
dev cao init

# With custom name
dev cao init my_orchestrator

# Skip prompts (use defaults)
dev cao init --yes
```

Creates `.cao/agents/<name>.md` with a template orchestrator configured for your project.

**Options:**
- `-y, --yes` - Skip prompts and use defaults

#### `dev cao install`

Install CAO (CLI Agent Orchestrator) and all common agents.

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
4. Installs all 30+ common agents from this repository

**Options:**
- `--cao-only` - Install only CAO prerequisites
- `--agents-only` - Install only agents (skip CAO)

#### `dev cao server`

Launch the CAO server.

```bash
dev cao server
```

Starts `cao-server` which enables agent communication and handoff.

#### `dev cao launch <agent>`

Launch a specific agent.

```bash
# Launch your orchestrator
dev cao launch my_project_orchestrator

# Launch a specialized agent
dev cao launch dev_frontend
```

#### `dev cao list`

List all available agents with descriptions.

```bash
dev cao list
```

Shows all 30+ agents organized by category.

## How to Use Agents

### Setup in Your Project

```bash
# In your project directory
cd my-project

# Create orchestrator
dev cao init

# Install CAO and agents
dev cao install
```

### Customize Orchestrator

Edit `.cao/agents/my-project_orchestrator.md` to add:
- Project-specific context
- Tech stack details
- Architecture notes
- Custom agent selection logic

### Launch and Work

```bash
# Start CAO server (in one terminal)
dev cao server

# Launch your orchestrator (in another terminal)
dev cao launch my-project_orchestrator
```

### Use Agent Handoff

In your orchestrator, delegate to specialized agents:

```typescript
handoff({
  agent: "dev_frontend",
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
- `dev_ux` → User flows, accessibility, mobile experience
- `dev_ui` → Components, styling, design system
- `dev_frontend` → React components, pages, client logic

**For Backend Tasks**:
- `dev_backend` → API routes, Server Actions, business logic
- `dev_database` → Schema design, queries, migrations
- `dev_api_integration` → External integrations

**For Quality Tasks**:
- `dev_testing` → Automated tests
- `dev_security` → Security and auth
- `dev_performance` → Optimizations

### Task Breakdown Example

**User**: "Create login page"

**Orchestrator**:
1. `dev_ux` → Design authentication flow
2. `dev_ui` → Form components and UI
3. `dev_backend` → Setup Auth.js and session management
4. `dev_database` → Users table and queries
5. `dev_security` → CSRF protection and validation
6. `dev_testing` → Test complete flow
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