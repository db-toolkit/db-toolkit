import { storeTelemetryBatch } from '../../utils/telemetry-db.js';

const VALID_EVENT_TYPES = ['feature_usage', 'database_usage', 'workspace_usage'];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST' && req.method !== 'OPTIONS') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const batch = req.body;

    // Validate batch structure
    if (!batch.events || !Array.isArray(batch.events)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid batch format. Expected { events: [], timestamp, version }' 
      });
    }

    if (!batch.version) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing version field' 
      });
    }

    // Validate events
    for (const event of batch.events) {
      if (!event.type || !VALID_EVENT_TYPES.includes(event.type)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid event type: ${event.type}. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` 
        });
      }

      if (!event.timestamp || !event.metadata) {
        return res.status(400).json({ 
          success: false, 
          error: 'Each event must have type, timestamp, and metadata' 
        });
      }
    }

    // Store batch
    const result = await storeTelemetryBatch(batch);

    return res.status(200).json({ 
      success: true,
      message: `Stored ${result.count} telemetry events`
    });

  } catch (error) {
    console.error('Error uploading telemetry:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
