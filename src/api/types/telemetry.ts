export interface TelemetryEvent {
  type: 'feature_usage' | 'database_usage' | 'workspace_usage';
  feature?: string;
  metadata: Record<string, any>;
  timestamp: number;
}

export interface TelemetryBatch {
  events: TelemetryEvent[];
  timestamp: number;
  version: string;
}

export interface TelemetryConfig {
  enabled: boolean;
  preferences: TelemetryPreferences;
  endpoint?: string;
  lastUpload?: number;
}

export interface TelemetryPreferences {
  featureUsage: boolean;
  systemInfo: boolean;
  databaseTypes: boolean;
  workspaceUsage: boolean;
}

export interface TelemetryStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  topFeatures: Array<{ feature: string; count: number }>;
  databaseTypes: Record<string, number>;
}
