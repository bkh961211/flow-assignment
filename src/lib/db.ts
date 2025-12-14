import { Pool, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL 환경 변수를 설정해주세요.');
}

export const pool = new Pool({ connectionString: DATABASE_URL });

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fixed_extensions (
      id SERIAL PRIMARY KEY,
      ext VARCHAR(20) UNIQUE NOT NULL,
      is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS custom_extensions (
      id SERIAL PRIMARY KEY,
      ext VARCHAR(20) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT custom_ext_length CHECK (char_length(ext) BETWEEN 1 AND 20)
    );
  `);
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}
