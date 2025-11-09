#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Command } from '@commander-js/extra-typings';

import { initCommand } from './commands/init.js';
import { installCommand } from './commands/install.js';
import { launchCommand } from './commands/launch.js';
import { listCommand } from './commands/list.js';
import { serverCommand } from './commands/server.js';

interface Package {
  name: string;
  version: string;
  description: string;
}

const packageDetails = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'),
) as Package;

const program = new Command()
  .name(packageDetails.name)
  .description(packageDetails.description)
  .version(packageDetails.version);

program.addCommand(initCommand);
program.addCommand(installCommand);
program.addCommand(serverCommand);
program.addCommand(launchCommand);
program.addCommand(listCommand);

program.parse();
