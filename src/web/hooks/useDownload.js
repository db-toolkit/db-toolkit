import { useState, useEffect } from 'react';
import { detectPlatform, getDownloadUrl } from '@/utils/detectPlatform';
import { API_URL } from '@/utils/constants';

export function useDownload() {
  const [downloading, setDownloading] = useState(null);
  const [platformUrl, setPlatformUrl] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = detectPlatform();
      setPlatformUrl(getDownloadUrl(platform));
    }
  }, []);

  const trackDownload = async (platform, source) => {
    try {
      await fetch(`${API_URL}/api/downloads/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, source })
      });
    } catch (error) {
      // Silent failure - don't block download
      console.error('Failed to track download:', error);
    }
  };

  const download = (url, filename, source = 'unknown') => {
    const downloadUrl = url || platformUrl;
    if (!downloadUrl) return;

    setDownloading(filename);
    
    // Track download
    const platform = detectPlatform();
    trackDownload(platform, source);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || '';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloading(null), 3000);
  };

  return { download, downloading, platformUrl };
}
