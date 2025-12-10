import { useState, useEffect } from 'react';
import { detectPlatform, getDownloadUrl } from '@/utils/detectPlatform';

export function useDownload() {
  const [downloading, setDownloading] = useState(null);
  const [platformUrl, setPlatformUrl] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const platform = detectPlatform();
      setPlatformUrl(getDownloadUrl(platform));
    }
  }, []);

  const download = (url, filename) => {
    const downloadUrl = url || platformUrl;
    if (!downloadUrl) return;

    setDownloading(filename);
    
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
