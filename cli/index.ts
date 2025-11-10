#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

import { bootstrap } from './commands/bootstrap.js';
import { caoCommand } from './commands/cao/index.js';
import { setup } from './commands/setup.js';

const program = new Command()
  .name('dev')
  .description('Shared configurations & AI agents for software projects')
  .version('0.1.0');

program.addCommand(bootstrap);
program.addCommand(setup);
program.addCommand(caoCommand);

program.parse();
