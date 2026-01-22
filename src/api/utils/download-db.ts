import { sql } from './database';

/**
 * Download tracking database operations
 */

export async function initDownloadsTable() {
  try {
    // Create downloads table
    await sql`
      CREATE TABLE IF NOT EXISTS downloads (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(20) NOT NULL,
        source VARCHAR(100),
        timestamp BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index on timestamp for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_timestamp 
      ON downloads(timestamp)
    `;

    // Create index on platform for stats queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_downloads_platform 
      ON downloads(platform)
    `;

    console.log('Downloads table initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Downloads table initialization failed:', error);
    return { success: false, error };
  }
}

export async function trackDownload(platform: string, source?: string) {
  try {
    await sql`
      INSERT INTO downloads (platform, source, timestamp)
      VALUES (${platform}, ${source || 'unknown'}, ${Date.now()})
    `;
    return { success: true };
  } catch (error) {
    console.error('Failed to track download:', error);
    throw error;
  }
}

export async function getDownloadStats() {
  try {
    // Get total count
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM downloads
    `;
    const total = parseInt(totalResult.rows[0].total);

    // Get count by platform
    const platformResult = await sql`
      SELECT platform, COUNT(*) as count 
      FROM downloads 
      GROUP BY platform
    `;

    const byPlatform: Record<string, number> = {
      windows: 0,
      macos: 0,
      linux: 0
    };

    platformResult.rows.forEach((row: any) => {
      byPlatform[row.platform] = parseInt(row.count);
    });

    return {
      success: true,
      data: {
        total,
        byPlatform
      }
    };
  } catch (error) {
    console.error('Failed to get download stats:', error);
    throw error;
  }
}
