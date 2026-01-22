import { initDownloadsTable } from '../utils/download-db.js';
import { initTelemetryTable } from '../utils/telemetry-db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const downloadsResult = await initDownloadsTable();
    const telemetryResult = await initTelemetryTable();

    if (downloadsResult.success && telemetryResult.success) {
      return res.status(200).json({ 
        success: true,
        message: 'Database initialized successfully',
        tables: ['downloads', 'telemetry_events']
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to initialize some tables',
        details: {
          downloads: downloadsResult,
          telemetry: telemetryResult
        }
      });
    }

  } catch (error) {
    console.error('Error initializing database:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
