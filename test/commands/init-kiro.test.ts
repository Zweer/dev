import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { fileExists } from '../../cli/utils/configs.js';

let tempDir: string;
let originalArgv: string[];

// Mock os.homedir to use a temp directory
vi.mock('node:os', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:os')>();
  return {
    ...actual,
    homedir: () => tempDir,
  };
});

beforeEach(async () => {
  const { mkdtemp } = await import('node:fs/promises');
  const os = await import('node:os');
  // Use actual tmpdir for creating the temp directory
  tempDir = await mkdtemp(join(os.tmpdir(), 'dev-kiro-'));
  originalArgv = process.argv;
});

afterEach(async () => {
  process.argv = originalArgv;
  await rm(tempDir, { recursive: true, force: true });
});

async function runInitKiro(): Promise<void> {
  const mod = await import('../../cli/commands/init-kiro.js');
  await mod.initKiro.parseAsync(['node', 'init-kiro']);
}

describe('init-kiro', () => {
  it('should copy agent file to ~/.kiro/agents/', async () => {
    await runInitKiro();

    expect(await fileExists(join(tempDir, '.kiro/agents/zweer-setup.json'))).toBe(true);
  });

  it('should copy prompt file to ~/.kiro/prompts/', async () => {
    await runInitKiro();

    expect(await fileExists(join(tempDir, '.kiro/prompts/zweer-setup.md'))).toBe(true);
  });

  it('should copy skills to ~/.kiro/skills/zweer-dev/', async () => {
    await runInitKiro();

    const skillsDir = join(tempDir, '.kiro/skills/zweer-dev');
    expect(await fileExists(join(skillsDir, 'agent-template/SKILL.md'))).toBe(true);
    expect(await fileExists(join(skillsDir, 'steering-templates/SKILL.md'))).toBe(true);
    expect(await fileExists(join(skillsDir, 'prompt-template/SKILL.md'))).toBe(true);
    expect(await fileExists(join(skillsDir, 'skill-templates/SKILL.md'))).toBe(true);
  });
});
