export interface DownloadEvent {
  platform: string;
  version: string;
  timestamp: number;
  source?: string;
}

export interface DownloadStats {
  total: number;
  byPlatform: Record<string, number>;
  byVersion: Record<string, number>;
}
