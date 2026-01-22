import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DownloadEvent, ApiResponse } from '../../types';

const VALID_PLATFORMS = ['windows', 'macos', 'linux'];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    } as ApiResponse);
  }

  try {
    const { platform, source } = req.body as Partial<DownloadEvent>;

    // Validate platform
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid platform. Must be: windows, macos, or linux' 
      } as ApiResponse);
    }

    const downloadEvent: DownloadEvent = {
      platform,
      timestamp: Date.now(),
      source: source || 'unknown'
    };

    // TODO: Store in database
    console.log('Download tracked:', downloadEvent);

    return res.status(200).json({ 
      success: true,
      message: 'Download tracked successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error tracking download:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    } as ApiResponse);
  }
}
