import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { paths } from './paths.js';

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export interface ConfigFile {
  src: string;
  dest: string;
}

export const CONFIG_FILES: ConfigFile[] = [
  { src: 'biome.json', dest: 'biome.json' },
  { src: 'editorconfig', dest: '.editorconfig' },
  { src: 'commitlint.config.ts', dest: 'commitlint.config.ts' },
  { src: 'lefthook.yml', dest: 'lefthook.yml' },
  { src: 'lockfile-lintrc.json', dest: '.lockfile-lintrc.json' },
  { src: 'npmpackagejsonlintrc.json', dest: '.npmpackagejsonlintrc.json' },
  { src: 'tsconfig.json', dest: 'tsconfig.json' },
  { src: 'tsdown.config.ts', dest: 'tsdown.config.ts' },
  { src: 'vitest.config.ts', dest: 'vitest.config.ts' },
];

export async function copyConfig(file: ConfigFile, targetDir: string): Promise<boolean> {
  const dest = join(targetDir, file.dest);
  if (await fileExists(dest)) return false;
  await copyFile(join(paths.configs, file.src), dest);
  return true;
}

export async function copyWorkflows(tier: 'base' | 'library' | 'docs', targetDir: string): Promise<void> {
  const srcDir = join(paths.workflows, tier);
  const destDir = join(targetDir, '.github/workflows');
  await mkdir(destDir, { recursive: true });

  for (const file of await readdir(srcDir)) {
    const dest = join(destDir, file);
    if (!(await fileExists(dest))) {
      await copyFile(join(srcDir, file), dest);
    }
  }
}

export async function mergePackageJson(
  targetDir: string,
  overrides: { scripts?: Record<string, string>; devDependencies?: Record<string, string> },
): Promise<void> {
  const pkgPath = join(targetDir, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

  if (overrides.scripts) {
    pkg.scripts = { ...pkg.scripts, ...overrides.scripts };
  }
  if (overrides.devDependencies) {
    pkg.devDependencies = { ...pkg.devDependencies, ...overrides.devDependencies };
  }

  await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
