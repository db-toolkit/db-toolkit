/**
 * Hook for managing database connection reconnection
 */
import { useState, useEffect, useRef } from 'react';
import { connectionsAPI } from '../../services/api';

export function useConnectionReconnect(connectionId, fetchSchemaTree, toast) {
  const [reconnecting, setReconnecting] = useState(false);
  const callbackRef = useRef(fetchSchemaTree);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = fetchSchemaTree;
  }, [fetchSchemaTree]);

  // Auto-reconnect on page load
  useEffect(() => {
    const reconnect = async () => {
      if (!connectionId) return;

      setReconnecting(true);
      let retries = 3;

      while (retries > 0) {
        try {
          await connectionsAPI.connect(connectionId);
          await callbackRef.current();
          setReconnecting(false);
          return;
        } catch (err) {
          retries--;
          console.error(`Reconnection attempt failed (${3 - retries}/3):`, err);
          if (retries > 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * (4 - retries)),
            );
          } else {
            toast.error("Failed to reconnect after 3 attempts");
          }
        }
      }

      setReconnecting(false);
    };

    reconnect();
  }, [connectionId, toast]);

  return { reconnecting };
}
