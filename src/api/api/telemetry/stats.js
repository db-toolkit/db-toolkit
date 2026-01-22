import { getTelemetryStats } from '../../utils/telemetry-db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const result = await getTelemetryStats();

    return res.status(200).json({ 
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching telemetry stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
