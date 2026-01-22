import { sql } from '@vercel/postgres';

/**
 * Base database utility
 * Provides common database operations
 */

export { sql };

export async function query<T = any>(queryString: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql.query(queryString, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function executeQuery(queryString: string, params?: any[]): Promise<void> {
  try {
    await sql.query(queryString, params);
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}
