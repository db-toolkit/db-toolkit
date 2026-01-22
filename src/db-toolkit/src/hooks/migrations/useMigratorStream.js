import { useRef, useState, useCallback } from 'react';
import { WS_ENDPOINTS } from '../../services/websocket';

export function useMigratorStream(onOutput) {
  const [isRunning, setIsRunning] = useState(false);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(WS_ENDPOINTS.MIGRATOR);

      ws.onopen = () => {
        wsRef.current = ws;
        resolve(ws);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'stdout' || data.type === 'stderr') {
          onOutput(data.data, data.type === 'stderr' ? 'error' : 'info');
        } else if (data.type === 'exit') {
          setIsRunning(false);
          onOutput(`Command exited with code ${data.code}`, data.success ? 'success' : 'error');
        } else if (data.type === 'error') {
          setIsRunning(false);
          onOutput(`Error: ${data.data}`, 'error');
        }
      };

      ws.onerror = () => {
        setIsRunning(false);
        reject(new Error('WebSocket connection failed'));
      };

      ws.onclose = () => {
        setIsRunning(false);
        wsRef.current = null;
      };
    });
  }, [onOutput]);

  const executeCommand = useCallback(async (command, cwd, dbUrl) => {
    try {
      setIsRunning(true);
      const ws = await connect();
      ws.send(JSON.stringify({ command, cwd, dbUrl }));
    } catch (error) {
      setIsRunning(false);
      onOutput(`Connection error: ${error.message}`, 'error');
    }
  }, [connect, onOutput]);

  return { executeCommand, isRunning };
}
