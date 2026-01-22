import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { DownloadStats, ApiResponse } from '../types';
import { getDownloadStats } from '../utils/download-db';

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
    const result = await getDownloadStats();

    return res.status(200).json({ 
      success: true,
      data: result.data
    } as ApiResponse<DownloadStats>);

  } catch (error) {
    console.error('Error fetching download stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    } as ApiResponse);
  }
}
