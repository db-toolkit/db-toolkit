/**
 * Hook for real-time analytics via WebSocket
 */
import { useState, useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { WS_ENDPOINTS } from '../services/websocket';
import api from '../services/api';

export function useAnalytics(connectionId) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 10;
  const toast = useToast();

  const connect = () => {
    if (!connectionId) return;

    setLoading(true);
    const ws = new WebSocket(WS_ENDPOINTS.ANALYTICS);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ connection_id: connectionId }));
      retryCountRef.current = 0;
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
        return;
      }

      if (data.success) {
        setAnalytics(data);
        setHistory(prev => [...prev.slice(-19), {
          timestamp: new Date(),
          cpu: data.system_stats.cpu_usage,
          memory: data.system_stats.memory_usage,
          connections: data.active_connections
        }]);
        setLoading(false);
      }
    };

    ws.onerror = () => {
      setLoading(false);
    };

    ws.onclose = () => {
      setLoading(false);
      
      if (retryCountRef.current < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000);
        retryCountRef.current++;
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [connectionId]);

  const killQuery = async (pid) => {
    try {
      const response = await api.post(`/analytics/connections/${connectionId}/kill`, { pid });
      
      if (response.data.success) {
        toast.success('Query terminated');
      } else {
        toast.error(response.data.error || 'Failed to kill query');
      }
    } catch (err) {
      toast.error('Failed to kill query');
    }
  };

  const getQueryPlan = async (query) => {
    try {
      const response = await api.post(`/analytics/connections/${connectionId}/query-plan`, { query });
      return response.data;
    } catch (err) {
      toast.error('Failed to get query plan');
      return null;
    }
  };

  const fetchHistoricalData = async (hours = 3) => {
    try {
      const response = await api.get(`/analytics/connections/${connectionId}/history?hours=${hours}`);
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (err) {
      // Silent fail
    }
  };

  const getSlowQueries = async (hours = 24) => {
    try {
      const response = await api.get(`/analytics/connections/${connectionId}/slow-queries?hours=${hours}`);
      return response.data.slow_queries || [];
    } catch (err) {
      return [];
    }
  };

  const getTableStats = async () => {
    try {
      const response = await api.get(`/analytics/connections/${connectionId}/table-stats`);
      return response.data.table_stats || [];
    } catch (err) {
      return [];
    }
  };

  const getPoolStats = async () => {
    try {
      const response = await api.get(`/analytics/connections/${connectionId}/pool-stats`);
      return response.data.pool_stats || null;
    } catch (err) {
      return null;
    }
  };

  const exportPDF = async () => {
    try {
      const response = await api.get(`/analytics/connections/${connectionId}/export-pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF exported successfully');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  return { 
    analytics, 
    loading, 
    history, 
    killQuery, 
    getQueryPlan, 
    fetchHistoricalData,
    getSlowQueries,
    getTableStats,
    getPoolStats,
    exportPDF
  };
}
