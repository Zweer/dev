#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';

import { bootstrap } from './commands/bootstrap.js';
import { initKiro } from './commands/init-kiro.js';
import { setup } from './commands/setup.js';

const program = new Command()
  .name('dev')
  .description('Shared configurations & Kiro AI templates for software projects')
  .version('2.0.0');

program.addCommand(bootstrap);
program.addCommand(setup);
program.addCommand(initKiro);

program.parse();
