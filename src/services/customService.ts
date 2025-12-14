import { query } from '../lib/db';
import { validateExtensionInput } from '../lib/extensions';

export interface CustomExtension {
  id: number;
  ext: string;
  created_at: Date;
}

async function ensureCapacity(): Promise<void> {
  const result = await query<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM custom_extensions'
  );
  const count = parseInt(result.rows[0].count, 10);
  if (count >= 200) {
    throw new Error('커스텀 확장자는 최대 200개까지 추가할 수 있습니다.');
  }
}

async function assertNotFixed(ext: string): Promise<void> {
  const exists = await query<{ exists: boolean }>(
    'SELECT EXISTS (SELECT 1 FROM fixed_extensions WHERE ext = $1) AS exists',
    [ext]
  );
  if (exists.rows[0].exists) {
    throw new Error('이미 고정 확장자 목록에 존재합니다.');
  }
}

export async function listCustomExtensions(): Promise<CustomExtension[]> {
  const result = await query<CustomExtension>(
    'SELECT id, ext, created_at FROM custom_extensions ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function addCustomExtension(rawExt: string): Promise<CustomExtension> {
  const ext = validateExtensionInput(rawExt);
  await ensureCapacity();
  await assertNotFixed(ext);

  try {
    const result = await query<CustomExtension>(
      'INSERT INTO custom_extensions (ext) VALUES ($1) RETURNING id, ext, created_at',
      [ext]
    );
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new Error('이미 추가된 커스텀 확장자입니다.');
    }
    throw error;
  }
}

export async function removeCustomExtension(rawExt: string): Promise<void> {
  const ext = validateExtensionInput(rawExt);
  const result = await query(
    'DELETE FROM custom_extensions WHERE ext = $1',
    [ext]
  );
  if (result.rowCount === 0) {
    throw new Error('삭제할 커스텀 확장자가 없습니다.');
  }
}
