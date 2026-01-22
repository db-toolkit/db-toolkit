import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DownloadStats, ApiResponse } from '../../types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    } as ApiResponse);
  }

  try {
    // TODO: Fetch from database
    const stats: DownloadStats = {
      total: 0,
      byPlatform: {
        windows: 0,
        macos: 0,
        linux: 0
      }
    };

    return res.status(200).json({ 
      success: true,
      data: stats
    } as ApiResponse<DownloadStats>);

  } catch (error) {
    console.error('Error fetching download stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    } as ApiResponse);
  }
}
