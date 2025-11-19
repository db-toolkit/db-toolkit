/**
 * Status bar showing system metrics and app info.
 */
import { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

function StatusBar() {
  const [metrics, setMetrics] = useState({
    ram: '0 MB',
    cpu: '0%',
    load: '0.0',
    disk: '0 GB / 0 GB',
    uptime: '0s'
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (window.performance && window.performance.memory) {
        const usedMemory = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
        setMetrics(prev => ({ ...prev, ram: `${usedMemory} MB` }));
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const updateUptime = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      setMetrics(prev => ({ 
        ...prev, 
        uptime: minutes > 0 ? `${minutes}m` : `${seconds}s` 
      }));
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center px-4 text-xs text-gray-600 dark:text-gray-400">
      <Tooltip text="Active connections" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          Connections 0
        </span>
      </Tooltip>
      
      <span className="mx-2">|</span>
      
      <Tooltip text="Memory usage" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          RAM {metrics.ram}
        </span>
      </Tooltip>
      
      <span className="mx-2">|</span>
      
      <Tooltip text="CPU usage" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          CPU {metrics.cpu}
        </span>
      </Tooltip>
      
      <span className="mx-2">|</span>
      
      <Tooltip text="System load" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          Load {metrics.load}
        </span>
      </Tooltip>
      
      <span className="mx-2">|</span>
      
      <Tooltip text="Disk usage" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          {metrics.disk}
        </span>
      </Tooltip>
      
      <span className="mx-2">|</span>
      
      <Tooltip text="Uptime" position="top">
        <span className="hover:text-gray-900 dark:hover:text-gray-200 cursor-default">
          {metrics.uptime}
        </span>
      </Tooltip>
    </div>
  );
}

export default StatusBar;
