import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { launchAgent } from '../../utils/cao.js';

export async function executeLaunch(agentName: string): Promise<void> {
  await launchAgent(agentName);
}

export const launchCommand = new Command()
  .name('launch')
  .description('Launch a specific agent')
  .argument('<agent>', 'Agent name to launch')
  .action(async (agentName) => {
    console.log(chalk.cyan(`🚀 Launching ${agentName}...\n`));

    try {
      await executeLaunch(agentName);
    } catch (error) {
      console.error(chalk.red(`Failed to launch ${agentName}`));
      console.error(error);
      process.exit(1);
    }
  });
