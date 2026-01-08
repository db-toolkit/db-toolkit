/**
 * Telemetry Hook
 * Frontend interface to telemetry system
 */

import { useState, useEffect, useRef } from 'react';
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '803ae15423ed320f88dade79cad9fa26';

export function useTelemetry() {
  const [enabled, setEnabled] = useState(false);
  const initialized = useRef(false);
  const [preferences, setPreferences] = useState({
    featureUsage: true,
    sessionDuration: true,
    systemInfo: true,
    databaseTypes: true,
    workspaceUsage: true
  });
  const [status, setStatus] = useState(null);

  // Initialize on mount
  useEffect(() => {
    loadTelemetryStatus();
  }, []);

  // Initialize Mixpanel when enabled
  useEffect(() => {
    if (enabled && !initialized.current) {
      mixpanel.init(MIXPANEL_TOKEN, { track_pageview: false, persistence: 'localStorage' });
      initialized.current = true;
    }
  }, [enabled]);

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
      mixpanel.track(`${feature}_${action}`, metadata);
      await window.electron.ipcRenderer.invoke('telemetry:trackFeature', feature, action, metadata);
    } catch (error) {
      console.error('Failed to track feature:', error);
    }
  };

  const trackDatabase = async (dbType, operation, metadata = {}) => {
    if (!enabled) return;
    
    try {
      mixpanel.track('database_usage', { dbType, operation, ...metadata });
      await window.electron.ipcRenderer.invoke('telemetry:trackDatabase', dbType, operation, metadata);
    } catch (error) {
      console.error('Failed to track database usage:', error);
    }
  };

  const trackSession = async (action, metadata = {}) => {
    if (!enabled) return;
    
    try {
      mixpanel.track(`session_${action}`, metadata);
      await window.electron.ipcRenderer.invoke('telemetry:trackSession', action, metadata);
    } catch (error) {
      console.error('Failed to track session:', error);
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
    trackSession,
    getTelemetryReport,
    clearTelemetryData
  };
}