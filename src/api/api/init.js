import { initDownloadsTable } from '../utils/download-db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const downloadsResult = await initDownloadsTable();

    if (downloadsResult.success) {
      return res.status(200).json({ 
        success: true,
        message: 'Database initialized successfully',
        tables: ['downloads']
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to initialize tables',
        details: {
          downloads: downloadsResult
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
