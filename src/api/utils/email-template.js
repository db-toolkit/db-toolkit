export function generateStatsEmailHTML(downloadStats, telemetryStats) {
  const { total: totalDownloads, byPlatform } = downloadStats;
  const { totalEvents, eventsByType, topFeatures, databaseTypes } = telemetryStats;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DB Toolkit Daily Stats</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #0ea5e9;
      margin-top: 0;
      font-size: 24px;
    }
    h2 {
      color: #334155;
      font-size: 18px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f8fafc;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #0ea5e9;
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #0f172a;
      margin-top: 5px;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    .list-item:last-child {
      border-bottom: none;
    }
    .list-label {
      color: #475569;
    }
    .list-value {
      font-weight: 600;
      color: #0f172a;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 DB Toolkit Daily Stats Report</h1>
    <p style="color: #64748b;">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

    <h2>📥 Downloads</h2>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Downloads</div>
        <div class="stat-value">${totalDownloads.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Windows</div>
        <div class="stat-value">${byPlatform.windows.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">macOS</div>
        <div class="stat-value">${byPlatform.macos.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Linux</div>
        <div class="stat-value">${byPlatform.linux.toLocaleString()}</div>
      </div>
    </div>

    <h2>📈 Telemetry Overview</h2>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Events</div>
        <div class="stat-value">${totalEvents.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Feature Usage</div>
        <div class="stat-value">${(eventsByType.feature_usage || 0).toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Database Usage</div>
        <div class="stat-value">${(eventsByType.database_usage || 0).toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Workspace Usage</div>
        <div class="stat-value">${(eventsByType.workspace_usage || 0).toLocaleString()}</div>
      </div>
    </div>

    <h2>🔥 Top Features</h2>
    <div>
      ${topFeatures.map((item, index) => `
        <div class="list-item">
          <span class="list-label">${index + 1}. ${item.feature}</span>
          <span class="list-value">${item.count.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>

    <h2>💾 Database Types</h2>
    <div>
      ${Object.entries(databaseTypes).map(([type, count]) => `
        <div class="list-item">
          <span class="list-label">${type}</span>
          <span class="list-value">${count.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>This is an automated report from DB Toolkit</p>
      <p>© ${new Date().getFullYear()} DB Toolkit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}
