/**
 * Telemetry Hook
 * Frontend interface to telemetry system
 */

import { useState, useEffect } from 'react';

export function useTelemetry() {
  const [enabled, setEnabled] = useState(false);
  const [preferences, setPreferences] = useState({
    featureUsage: true,
    systemInfo: true,
    databaseTypes: true,
    workspaceUsage: true
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    loadTelemetryStatus();
  }, []);

  const loadTelemetryStatus = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('telemetry:getStatus');
      if (result.success) {
        setEnabled(result.status.enabled);
        if (result.status.preferences) {
          setPreferences(result.status.preferences);
        }
        setStatus(result.status);
      }
    } catch (error) {
      console.error('Failed to load telemetry status:', error);
    }
  };

  const enableTelemetry = async (newEnabled) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('telemetry:setEnabled', newEnabled);
      if (result.success) {
        setEnabled(newEnabled);
      }
    } catch (error) {
      console.error('Failed to enable telemetry:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const result = await window.electron.ipcRenderer.invoke('telemetry:setPreferences', newPreferences);
      if (result.success) {
        setPreferences(result.preferences);
      }
    } catch (error) {
      console.error('Failed to update telemetry preferences:', error);
    }
  };

  const trackFeature = async (feature, action, metadata = {}) => {
    if (!enabled) return;
    
    try {
      await window.electron.ipcRenderer.invoke('telemetry:trackFeature', feature, action, metadata);
    } catch (error) {
      console.error('Failed to track feature:', error);
    }
  };

  const trackDatabase = async (dbType, operation, metadata = {}) => {
    if (!enabled) return;
    
    try {
      await window.electron.ipcRenderer.invoke('telemetry:trackDatabase', dbType, operation, metadata);
    } catch (error) {
      console.error('Failed to track database usage:', error);
    }
  };

  const getTelemetryReport = async () => {
    if (!enabled) return null;
    
    try {
      return await window.electron.ipcRenderer.invoke('telemetry:getReport');
    } catch (error) {
      console.error('Failed to get telemetry report:', error);
      return null;
    }
  };

  const clearTelemetryData = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke('telemetry:clear');
      if (result.success) {
        setStatus(prev => ({ ...prev, pendingEvents: 0 }));
      }
      return result;
    } catch (error) {
      console.error('Failed to clear telemetry data:', error);
    }
  };

  return {
    enabled,
    preferences,
    status,
    enableTelemetry,
    updatePreferences,
    trackFeature,
    trackDatabase,
    getTelemetryReport,
    clearTelemetryData
  };
}
