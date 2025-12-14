import { query } from '../lib/db';
import { normalizeExtension } from '../lib/extensions';

export interface FixedExtension {
  ext: string;
  is_blocked: boolean;
}

export async function getFixedExtensions(): Promise<FixedExtension[]> {
  const result = await query<FixedExtension>(
    'SELECT ext, is_blocked FROM fixed_extensions ORDER BY ext'
  );
  return result.rows;
}

export async function setFixedExtensionState(
  rawExt: string,
  blocked: boolean
): Promise<FixedExtension> {
  const ext = normalizeExtension(rawExt);
  const result = await query<FixedExtension>(
    'UPDATE fixed_extensions SET is_blocked = $1 WHERE ext = $2 RETURNING ext, is_blocked',
    [blocked, ext]
  );

  if (result.rowCount === 0) {
    throw new Error('존재하지 않는 고정 확장자입니다.');
  }

  return result.rows[0];
}
