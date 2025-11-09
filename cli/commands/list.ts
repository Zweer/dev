import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';

import { type Agent, getAllAgents } from '../utils/agents.js';

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
  .action(async () => {
    const agents = await getAllAgents();

    console.log(chalk.bold('\n📦 Available Agents:\n'));

    const grouped = groupAgentsByCategory(agents);

    for (const [category, categoryAgents] of Object.entries(grouped)) {
      console.log(chalk.cyan(`\n${category}:`));

      for (const agent of categoryAgents) {
        const desc = agent.description ? chalk.gray(` - ${agent.description}`) : '';
        console.log(`  ${chalk.green(agent.name)}${desc}`);
      }
    }

    console.log(chalk.gray(`\nTotal: ${agents.length} agents\n`));
  });
