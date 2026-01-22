export interface TelemetryData {
  userId: string;
  appVersion: string;
  platform: string;
  timestamp: number;
  events: TelemetryEvents;
}

export interface TelemetryEvents {
  featureUsage?: Record<string, number>;
  sessionDuration?: number;
  systemInfo?: SystemInfo;
  databaseTypes?: string[];
  workspaceCount?: number;
}

export interface SystemInfo {
  os: string;
  arch: string;
  nodeVersion: string;
}
