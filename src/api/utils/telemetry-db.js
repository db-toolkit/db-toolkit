import { sql } from './database.js';

export async function initTelemetryTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS telemetry_events (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        feature VARCHAR(100),
        metadata JSONB,
        timestamp BIGINT NOT NULL,
        version VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_telemetry_type 
      ON telemetry_events(type)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp 
      ON telemetry_events(timestamp)
    `;

    console.log('Telemetry table initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Telemetry table initialization failed:', error);
    return { success: false, error };
  }
}

export async function storeTelemetryBatch(batch) {
  try {
    const { events, version } = batch;

    for (const event of events) {
      await sql`
        INSERT INTO telemetry_events (type, feature, metadata, timestamp, version)
        VALUES (
          ${event.type}, 
          ${event.feature || null}, 
          ${JSON.stringify(event.metadata)}, 
          ${event.timestamp},
          ${version}
        )
      `;
    }

    return { success: true, count: events.length };
  } catch (error) {
    console.error('Failed to store telemetry batch:', error);
    throw error;
  }
}

export async function getTelemetryStats() {
  try {
    // Total events
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM telemetry_events
    `;
    const totalEvents = parseInt(totalResult.rows[0].total);

    // Events by type
    const typeResult = await sql`
      SELECT type, COUNT(*) as count 
      FROM telemetry_events 
      GROUP BY type
    `;
    const eventsByType = {};
    typeResult.rows.forEach((row) => {
      eventsByType[row.type] = parseInt(row.count);
    });

    // Top features
    const featuresResult = await sql`
      SELECT feature, COUNT(*) as count 
      FROM telemetry_events 
      WHERE feature IS NOT NULL AND type = 'feature_usage'
      GROUP BY feature 
      ORDER BY count DESC 
      LIMIT 10
    `;
    const topFeatures = featuresResult.rows.map((row) => ({
      feature: row.feature,
      count: parseInt(row.count)
    }));

    // Database types
    const dbTypesResult = await sql`
      SELECT 
        metadata->>'dbType' as db_type,
        COUNT(*) as count
      FROM telemetry_events
      WHERE type = 'database_usage' AND metadata->>'dbType' IS NOT NULL
      GROUP BY metadata->>'dbType'
    `;
    const databaseTypes = {};
    dbTypesResult.rows.forEach((row) => {
      if (row.db_type) {
        databaseTypes[row.db_type] = parseInt(row.count);
      }
    });

    return {
      success: true,
      data: {
        totalEvents,
        eventsByType,
        topFeatures,
        databaseTypes
      }
    };
  } catch (error) {
    console.error('Failed to get telemetry stats:', error);
    throw error;
  }
}
