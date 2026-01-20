/**
 * Hook for managing analytics connection state
 */
import { useState, useEffect } from 'react';

export function useAnalyticsConnection(connections, connectToDatabase, getWorkspaceState, setWorkspaceState, activeWorkspaceId, toast) {
  const [connectionId, setConnectionId] = useState(null);
  const [connectionName, setConnectionName] = useState("");
  const [connecting, setConnecting] = useState(null);

  // Sync with workspace state when workspace changes
  useEffect(() => {
    const savedConnectionId = getWorkspaceState("analyticsConnectionId");
    const savedConnectionName = getWorkspaceState("analyticsConnectionName");

    if (savedConnectionId) {
      setConnectionId(savedConnectionId);
      setConnectionName(savedConnectionName || "");
    } else {
      setConnectionId(null);
      setConnectionName("");
    }
  }, [activeWorkspaceId]);

  const handleConnect = async (id) => {
    setConnecting(id);
    try {
      await connectToDatabase(id, true);
      const conn = connections.find((c) => c.id === id);
      setConnectionId(id);
      setConnectionName(conn?.name || "");
      setWorkspaceState("analyticsConnectionId", id);
      setWorkspaceState("analyticsConnectionName", conn?.name || "");
      toast.success("Connected successfully");
    } catch (err) {
      toast.error("Failed to connect");
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = () => {
    setConnectionId(null);
    setConnectionName("");
    setWorkspaceState("analyticsConnectionId", null);
    setWorkspaceState("analyticsConnectionName", "");
  };

  return {
    connectionId,
    connectionName,
    connecting,
    handleConnect,
    handleDisconnect,
  };
}
