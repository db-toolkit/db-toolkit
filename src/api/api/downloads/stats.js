import { getDownloadStats } from '../../utils/download-db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const result = await getDownloadStats();

    return res.status(200).json({ 
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error fetching download stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
