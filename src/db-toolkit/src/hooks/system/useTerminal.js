/**
 * Hook for terminal WebSocket connection.
 */
import { useEffect, useRef, useState } from 'react';
import { WS_ENDPOINTS } from '../../services/websocket';

export function useTerminal(onData) {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_ENDPOINTS.TERMINAL);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      if (onData) {
        if (event.data instanceof Blob) {
          event.data.arrayBuffer().then((buffer) => {
            onData(new Uint8Array(buffer), 'data');
          });
        } else {
          onData(event.data, 'data');
        }
      }
    };

    ws.onerror = () => {
      if (onData) {
        onData('\r\n\x1b[31mWebSocket connection error\x1b[0m\r\n', 'error');
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (onData) {
        onData('\r\n\x1b[33mTerminal disconnected\x1b[0m\r\n', 'info');
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [onData]);

  const sendData = (data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  };

  return { sendData, isConnected };
}
