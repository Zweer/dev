import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { paths } from '../utils/paths.js';

export interface OrchestratorConfig {
  name: string;
  projectName: string;
  projectPath: string;
  techStack: string;
  projectStructure: string;
}

export async function createOrchestrator(
  config: OrchestratorConfig,
): Promise<{ orchestratorPath: string }> {
  // Read template
  const templatePath = join(paths.templates, 'orchestrator.md');
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

  // Write orchestrator file
  const orchestratorPath = join(caoDir, `${config.name}.md`);
  await writeFile(orchestratorPath, template);

  return { orchestratorPath };
}

export function getDefaultConfig(cwd: string, name?: string): OrchestratorConfig {
  const projectName = basename(cwd);
  return {
    name: name || `${projectName}_orchestrator`,
    projectName,
    projectPath: cwd,
    techStack: 'Next.js, TypeScript, PostgreSQL',
    projectStructure: 'app/, components/, lib/',
  };
}

export const initCommand = new Command()
  .name('init')
  .description('Create orchestrator in current project')
  .argument('[name]', 'Orchestrator name')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (name, options) => {
    const cwd = process.cwd();
    let config = getDefaultConfig(cwd, name);

    if (!options.yes) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Orchestrator name:',
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

    console.log(chalk.cyan(`\n🎯 Creating orchestrator: ${config.name}\n`));

    try {
      const { orchestratorPath } = await createOrchestrator(config);

      console.log(chalk.green(`✅ Orchestrator created: ${orchestratorPath}\n`));
      console.log(chalk.gray('Next steps:'));
      console.log(chalk.gray('  1. Edit the orchestrator to add project-specific details'));
      console.log(chalk.gray('  2. Run: dev install'));
      console.log(chalk.gray(`  3. Run: cao launch --agents ${config.name}`));
      console.log();
    } catch (error) {
      console.error(chalk.red('Failed to create orchestrator'));
      console.error(error);
      process.exit(1);
    }
  });
