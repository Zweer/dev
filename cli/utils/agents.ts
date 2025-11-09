import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { paths } from './paths.js';

export interface Agent {
  name: string;
  path: string;
  category: string;
  subcategory?: string;
  description?: string;
}

export async function getAllAgents(): Promise<Agent[]> {
  const agents: Agent[] = [];
  const categories = await readdir(paths.agents, { withFileTypes: true });

  for (const category of categories) {
    if (!category.isDirectory()) continue;

    const categoryPath = join(paths.agents, category.name);
    const items = await readdir(categoryPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        // Subcategory (es: web/frontend)
        const subcategoryPath = join(categoryPath, item.name);
        const files = await readdir(subcategoryPath);

        for (const file of files) {
          if (file.endsWith('.md')) {
            const agentPath = join(subcategoryPath, file);
            const description = await extractDescription(agentPath);

            agents.push({
              name: file.replace('.md', ''),
              path: agentPath,
              category: category.name,
              subcategory: item.name,
              description,
            });
          }
        }
      } else if (item.name.endsWith('.md')) {
        // Direct agent file (es: data/data_engineer.md)
        const agentPath = join(categoryPath, item.name);
        const description = await extractDescription(agentPath);

        agents.push({
          name: item.name.replace('.md', ''),
          path: agentPath,
          category: category.name,
          description,
        });
      }
    }
  }

  return agents;
}

async function extractDescription(agentPath: string): Promise<string | undefined> {
  try {
    const content = await readFile(agentPath, 'utf-8');
    const match = content.match(/^description:\s*["']?(.+?)["']?$/m);
    return match?.[1];
  } catch {
    return undefined;
  }
}
