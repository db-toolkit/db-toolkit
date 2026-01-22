import { trackDownload } from '../../utils/download-db.js';

const VALID_PLATFORMS = ['windows', 'macos', 'linux'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { platform, source } = req.body;

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid platform. Must be: windows, macos, or linux' 
      });
    }

    await trackDownload(platform, source);

    return res.status(200).json({ 
      success: true,
      message: 'Download tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking download:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
