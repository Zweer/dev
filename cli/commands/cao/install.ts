import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import ora from 'ora';

import { getAllAgents } from '../../utils/agents.js';
import { installAgent, installCao } from '../../utils/cao.js';

export async function executeInstallCao(): Promise<void> {
  await installCao();
}

export async function executeInstallAgents(): Promise<{ installed: number; failed: number }> {
  const agents = await getAllAgents();
  let installed = 0;
  let failed = 0;

  for (const agent of agents) {
    try {
      await installAgent(agent.path);
      installed++;
    } catch {
      failed++;
    }
  }

  return { installed, failed };
}

export const installCommand = new Command()
  .name('install')
  .description('Install CAO and all common agents')
  .option('--cao-only', 'Install only CAO')
  .option('--agents-only', 'Install only agents')
  .action(async (options) => {
    const installCaoOnly = options.caoOnly;
    const installAgentsOnly = options.agentsOnly;

    // Install CAO
    if (!installAgentsOnly) {
      const spinner = ora('Installing CAO prerequisites...').start();

      try {
        await executeInstallCao();
        spinner.succeed(chalk.green('CAO installed successfully'));
      } catch (error) {
        spinner.fail(chalk.red('Failed to install CAO'));
        console.error(error);
        process.exit(1);
      }
    }

    // Install agents
    if (!installCaoOnly) {
      const agents = await getAllAgents();
      const spinner = ora(`Installing ${agents.length} agents...`).start();

      const { installed, failed } = await executeInstallAgents();

      if (failed === 0) {
        spinner.succeed(chalk.green(`All ${installed} agents installed successfully`));
      } else {
        spinner.warn(chalk.yellow(`Installed ${installed} agents, ${failed} failed`));
      }
    }

    console.log(chalk.bold.green('\n✅ Installation complete!\n'));
  });
