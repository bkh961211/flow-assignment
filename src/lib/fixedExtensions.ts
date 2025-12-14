import { query } from './db';
import { normalizeExtension } from './extensions';

export const DEFAULT_FIXED_EXTENSIONS = [
  'exe',
  'sh',
  'bat',
  'cmd',
  'msi',
  'com',
  'js',
  'ps1',
  'php',
  'jar',
];

export async function seedFixedExtensions(): Promise<void> {
  const normalized = DEFAULT_FIXED_EXTENSIONS.map(normalizeExtension);
  const values = normalized.map((ext) => `('${ext}')`).join(',');
  await query(`
    INSERT INTO fixed_extensions (ext)
    VALUES ${values}
    ON CONFLICT (ext) DO NOTHING;
  `);
}
