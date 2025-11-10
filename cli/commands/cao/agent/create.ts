import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { paths } from '../../../utils/paths.js';

export interface AgentConfig {
  name: string;
  projectName: string;
  projectPath: string;
  techStack: string;
  projectStructure: string;
  template: string;
}

export async function createAgent(config: AgentConfig): Promise<{ agentPath: string }> {
  // Read template
  const templatePath = join(paths.templates, `${config.template}.md`);
  let template = await readFile(templatePath, 'utf-8');

  // Replace placeholders
  template = template
    .replace(/\{\{PROJECT_NAME\}\}/g, config.projectName)
    .replace(/\{\{PROJECT_PATH\}\}/g, config.projectPath)
    .replace(/\{\{TECH_STACK\}\}/g, config.techStack)
    .replace(/\{\{PROJECT_STRUCTURE\}\}/g, config.projectStructure);

  // Create .cao/agents directory
  const caoDir = join(config.projectPath, '.cao', 'agents');
  await mkdir(caoDir, { recursive: true });

  // Write agent file
  const agentPath = join(caoDir, `${config.name}.md`);
  await writeFile(agentPath, template);

  return { agentPath };
}

export function getDefaultConfig(cwd: string, name?: string, template?: string): AgentConfig {
  const projectName = basename(cwd);
  return {
    name: name || `${projectName}_orchestrator`,
    projectName,
    projectPath: cwd,
    techStack: 'Next.js, TypeScript, PostgreSQL',
    projectStructure: 'app/, components/, lib/',
    template: template || 'orchestrator',
  };
}

export const createCommand = new Command()
  .name('create')
  .description('Create a new agent in current project')
  .argument('[name]', 'Agent name')
  .option('-t, --template <template>', 'Template to use (orchestrator, specialist)', 'orchestrator')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (name, options) => {
    const cwd = process.cwd();
    let config = getDefaultConfig(cwd, name, options.template);

    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Agent name:',
          default: config.name,
        },
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: config.projectName,
        },
        {
          type: 'input',
          name: 'techStack',
          message: 'Tech stack:',
          default: config.techStack,
        },
        {
          type: 'input',
          name: 'projectStructure',
          message: 'Main folders:',
          default: config.projectStructure,
        },
      ]);

      config = { ...config, ...answers };
    }

    console.log(chalk.cyan(`\n🎯 Creating agent: ${config.name}\n`));

    try {
      const { agentPath } = await createAgent(config);

      console.log(chalk.green(`✔ Agent created: ${agentPath}\n`));
      console.log(chalk.dim('Next steps:'));
      console.log(chalk.dim('  1. Edit the agent to add project-specific details'));
      console.log(chalk.dim('  2. Run: dev cao sync'));
      console.log(chalk.dim(`  3. Run: dev cao launch ${config.name}`));
      console.log();
    } catch (error) {
      console.error(chalk.red('✖ Failed to create agent'));
      console.error(error);
      process.exit(1);
    }
  });
