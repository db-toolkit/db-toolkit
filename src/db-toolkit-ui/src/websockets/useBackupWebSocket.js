import { useEffect, useRef } from 'react';
import { WS_ENDPOINTS } from '../services/websocket';
import { useNotifications } from '../contexts/NotificationContext';

export function useBackupWebSocket(onUpdate) {
  const wsRef = useRef(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const ws = new WebSocket(WS_ENDPOINTS.BACKUPS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'backup_update') {
        onUpdate(data);
        
        if (data.status === 'completed') {
          addNotification({
            type: 'success',
            title: 'Backup Complete',
            message: `Backup for ${data.connection_name || 'database'} completed successfully`,
            action: { label: 'View', path: '/backups' }
          });
        } else if (data.status === 'failed') {
          addNotification({
            type: 'error',
            title: 'Backup Failed',
            message: data.error || 'Backup operation failed',
            action: { label: 'View', path: '/backups' }
          });
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [onUpdate, addNotification]);

  return wsRef;
}
