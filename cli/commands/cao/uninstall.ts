import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { getInstalledAgents, uninstallAgent } from '../../utils/cao.js';

export const uninstallCommand = new Command()
  .name('uninstall')
  .description('Uninstall an agent')
  .argument('<agent>', 'Agent name to uninstall')
  .action(async (agentName) => {
    const installed = await getInstalledAgents();

    if (!installed.includes(agentName)) {
      console.error(chalk.red(`\n❌ Agent "${agentName}" is not installed\n`));
      process.exit(1);
    }

    await uninstallAgent(agentName);
    console.log(chalk.green(`\n✓ Agent "${agentName}" uninstalled successfully\n`));
  });
