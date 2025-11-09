import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const paths = {
  // Root del pacchetto @zweer/dev
  root: join(__dirname, '../..'),

  // Cartelle del pacchetto
  agents: join(__dirname, '../../agents'),
  templates: join(__dirname, '../../templates'),
};
