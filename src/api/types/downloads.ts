export interface DownloadEvent {
  platform: string;
  timestamp: number;
  source?: string;
}

export interface DownloadStats {
  total: number;
  byPlatform: Record<string, number>;
}
