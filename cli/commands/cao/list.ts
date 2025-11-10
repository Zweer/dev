import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { type Agent, getAllAgents } from '../../utils/agents.js';
import { getInstalledAgents } from '../../utils/cao.js';

export function groupAgentsByCategory(agents: Agent[]): Record<string, Agent[]> {
  return agents.reduce(
    (acc, agent) => {
      const key = agent.subcategory ? `${agent.category}/${agent.subcategory}` : agent.category;

      if (!acc[key]) acc[key] = [];
      acc[key].push(agent);
      return acc;
    },
    {} as Record<string, Agent[]>,
  );
}

export const listCommand = new Command()
  .name('list')
  .description('List all available agents')
  .option('--installed', 'Show only installed agents')
  .action(async (options) => {
    const agents = await getAllAgents();
    const installed = await getInstalledAgents();
    const installedSet = new Set(installed);

    const filtered = options.installed ? agents.filter((a) => installedSet.has(a.name)) : agents;

    console.log(chalk.bold(`\n📦 ${options.installed ? 'Installed' : 'Available'} Agents:\n`));

    const grouped = groupAgentsByCategory(filtered);

    for (const [category, categoryAgents] of Object.entries(grouped)) {
      console.log(chalk.cyan(`\n${category}:`));

      for (const agent of categoryAgents) {
        const isInstalled = installedSet.has(agent.name);
        const status = isInstalled ? chalk.green('✓') : chalk.gray('○');
        const desc = agent.description ? chalk.gray(` - ${agent.description}`) : '';
        console.log(`  ${status} ${chalk.green(agent.name)}${desc}`);
      }
    }

    const installedCount = filtered.filter((a) => installedSet.has(a.name)).length;
    console.log(
      chalk.gray(
        `\nTotal: ${filtered.length} agents (${installedCount} installed, ${filtered.length - installedCount} available)\n`,
      ),
    );
  });
