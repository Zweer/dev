import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { getAllAgents } from '../../utils/agents.js';
import { getInstalledAgents } from '../../utils/cao.js';

export const statusCommand = new Command()
  .name('status')
  .description('Show installation status of all agents')
  .action(async () => {
    const agents = await getAllAgents();
    const installed = await getInstalledAgents();
    const installedSet = new Set(installed);

    const installedAgents = agents.filter((a) => installedSet.has(a.name));
    const notInstalledAgents = agents.filter((a) => !installedSet.has(a.name));

    console.log(chalk.bold('\n📊 Agent Installation Status\n'));

    console.log(chalk.green(`✓ Installed: ${installedAgents.length}`));
    console.log(chalk.gray(`○ Not installed: ${notInstalledAgents.length}`));
    console.log(chalk.cyan(`📦 Total: ${agents.length}\n`));

    if (notInstalledAgents.length > 0) {
      console.log(chalk.yellow('Not installed agents:'));
      for (const agent of notInstalledAgents) {
        console.log(chalk.gray(`  ○ ${agent.name}`));
      }
      console.log();
    }
  });
