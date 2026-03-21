import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

export const paths: { root: string; configs: string; kiro: string; workflows: string } = {
  root: join(__dirname, '../..'),
  configs: join(__dirname, '../../configs'),
  kiro: join(__dirname, '../../kiro'),
  workflows: join(__dirname, '../../workflows'),
};
