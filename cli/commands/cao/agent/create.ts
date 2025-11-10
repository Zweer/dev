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
  techStack?: string;
  projectStructure?: string;
  platform?: string;
  targetPlatforms?: string;
  iacTool?: string;
  runtime?: string;
  serviceMesh?: string;
  contentType?: string;
  audience?: string;
  tone?: string;
  template: string;
}

export async function createAgent(config: AgentConfig): Promise<{ agentPath: string }> {
  // Read template
  const templatePath = join(paths.templates, `${config.template}.md`);
  let template = await readFile(templatePath, 'utf-8');

  // Replace common placeholders
  template = template
    .replace(/\{\{PROJECT_NAME\}\}/g, config.projectName)
    .replace(/\{\{PROJECT_PATH\}\}/g, config.projectPath);

  // Replace template-specific placeholders
  if (config.techStack) template = template.replace(/\{\{TECH_STACK\}\}/g, config.techStack);
  if (config.projectStructure)
    template = template.replace(/\{\{PROJECT_STRUCTURE\}\}/g, config.projectStructure);
  if (config.platform) template = template.replace(/\{\{PLATFORM\}\}/g, config.platform);
  if (config.targetPlatforms)
    template = template.replace(/\{\{TARGET_PLATFORMS\}\}/g, config.targetPlatforms);
  if (config.iacTool) template = template.replace(/\{\{IAC_TOOL\}\}/g, config.iacTool);
  if (config.runtime) template = template.replace(/\{\{RUNTIME\}\}/g, config.runtime);
  if (config.serviceMesh) template = template.replace(/\{\{SERVICE_MESH\}\}/g, config.serviceMesh);
  if (config.contentType) template = template.replace(/\{\{CONTENT_TYPE\}\}/g, config.contentType);
  if (config.audience) template = template.replace(/\{\{AUDIENCE\}\}/g, config.audience);
  if (config.tone) template = template.replace(/\{\{TONE\}\}/g, config.tone);

  // Replace any remaining placeholders with empty string
  template = template.replace(/\{\{[A-Z_]+\}\}/g, '');

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
  const baseConfig = {
    name: name || `${projectName}_orchestrator`,
    projectName,
    projectPath: cwd,
    template: template || 'orchestrator_webapp',
  };

  // Template-specific defaults
  switch (template) {
    case 'orchestrator_mobile':
      return {
        ...baseConfig,
        platform: 'React Native',
        targetPlatforms: 'iOS, Android',
      };
    case 'orchestrator_lambda':
      return {
        ...baseConfig,
        iacTool: 'AWS CDK',
        runtime: 'Node.js 20',
      };
    case 'orchestrator_microservices':
      return {
        ...baseConfig,
        platform: 'EKS',
        serviceMesh: 'None',
      };
    case 'orchestrator_writing':
      return {
        ...baseConfig,
        contentType: 'Blog',
        audience: 'Developers',
        tone: 'Professional',
      };
    default:
      return {
        ...baseConfig,
        techStack: 'Next.js, TypeScript, PostgreSQL',
        projectStructure: 'app/, components/, lib/',
      };
  }
}

export const createCommand = new Command()
  .name('create')
  .description('Create a new agent in current project')
  .argument('[name]', 'Agent name')
  .option(
    '-t, --template <template>',
    'Template to use (orchestrator_webapp, orchestrator_mobile, orchestrator_lambda, orchestrator_microservices, orchestrator_writing)',
    'orchestrator_webapp',
  )
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (name, options) => {
    const cwd = process.cwd();
    let config = getDefaultConfig(cwd, name, options.template);

    if (!options.yes) {
      // Common prompts
      const commonAnswers = await inquirer.prompt([
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
      ]);

      config = { ...config, ...commonAnswers };

      // Template-specific prompts
      let specificAnswers = {};

      switch (options.template) {
        case 'orchestrator_mobile':
          specificAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'platform',
              message: 'Mobile platform:',
              default: config.platform,
            },
            {
              type: 'input',
              name: 'targetPlatforms',
              message: 'Target platforms:',
              default: config.targetPlatforms,
            },
          ]);
          break;

        case 'orchestrator_lambda':
          specificAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'iacTool',
              message: 'IaC tool:',
              default: config.iacTool,
            },
            {
              type: 'input',
              name: 'runtime',
              message: 'Lambda runtime:',
              default: config.runtime,
            },
          ]);
          break;

        case 'orchestrator_microservices':
          specificAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'platform',
              message: 'Container platform:',
              default: config.platform,
            },
            {
              type: 'input',
              name: 'serviceMesh',
              message: 'Service mesh:',
              default: config.serviceMesh,
            },
          ]);
          break;

        case 'orchestrator_writing':
          specificAnswers = await inquirer.prompt([
            {
              type: 'input',
              name: 'contentType',
              message: 'Content type:',
              default: config.contentType,
            },
            {
              type: 'input',
              name: 'audience',
              message: 'Target audience:',
              default: config.audience,
            },
            {
              type: 'input',
              name: 'tone',
              message: 'Tone:',
              default: config.tone,
            },
          ]);
          break;

        default:
          specificAnswers = await inquirer.prompt([
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
      }

      config = { ...config, ...specificAnswers };
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
