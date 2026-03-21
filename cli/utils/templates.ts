import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function copyTemplate(
  templateDir: string,
  targetDir: string,
  vars: Record<string, string>,
): Promise<void> {
  const entries = await readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const src = join(templateDir, entry.name);
    const dest = join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true });
      await copyTemplate(src, dest, vars);
    } else {
      let content = await readFile(src, 'utf-8');
      for (const [key, value] of Object.entries(vars)) {
        content = content.replaceAll(`{{${key}}}`, value);
      }
      await writeFile(dest, content);
    }
  }
}
