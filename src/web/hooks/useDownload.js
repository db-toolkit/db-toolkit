import { useState } from 'react';

export function useDownload() {
  const [downloading, setDownloading] = useState(null);

  const download = (url, filename) => {
    setDownloading(filename);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || '';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloading(null), 3000);
  };

  return { download, downloading };
}
