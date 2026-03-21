import { cp, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { Command } from '@commander-js/extra-typings';

import { paths } from '../utils/paths.js';

export const initKiro = new Command()
  .name('init-kiro')
  .description('Install the zweer-setup agent globally for Kiro-powered project configuration')
  .action(async () => {
    const home = homedir();
    const kiroDir = join(home, '.kiro');

    // Copy agent
    await mkdir(join(kiroDir, 'agents'), { recursive: true });
    await cp(join(paths.kiro, 'agents/zweer-setup.json'), join(kiroDir, 'agents/zweer-setup.json'));

    // Copy prompt
    await mkdir(join(kiroDir, 'prompts'), { recursive: true });
    await cp(join(paths.kiro, 'prompts/zweer-setup.md'), join(kiroDir, 'prompts/zweer-setup.md'));

    // Copy skills
    const skillsDest = join(kiroDir, 'skills/zweer-dev');
    await cp(join(paths.kiro, 'skills'), skillsDest, { recursive: true });

    console.log('✓ zweer-setup agent installed globally');
    console.log(`\n  Agent:  ${join(kiroDir, 'agents/zweer-setup.json')}`);
    console.log(`  Prompt: ${join(kiroDir, 'prompts/zweer-setup.md')}`);
    console.log(`  Skills: ${skillsDest}/`);
    console.log('\nTo configure this project:');
    console.log('  1. Run: kiro-cli chat');
    console.log('  2. Use: /agent swap zweer-setup');
  });
