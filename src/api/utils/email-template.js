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
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 15px;
    }
    h1 {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .date {
      color: #6b7280;
      font-size: 14px;
      margin-top: 8px;
    }
    h2 {
      color: #111827;
      font-size: 20px;
      margin-top: 35px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-icon {
      font-size: 24px;
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 20px;
      border-radius: 10px;
      border: 2px solid #10b981;
      transition: transform 0.2s;
    }
    .stat-label {
      font-size: 11px;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
    }
    .stat-value {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-top: 8px;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #f9fafb;
      transition: all 0.2s;
    }
    .list-item:hover {
      background: #f0fdf4;
      transform: translateX(5px);
    }
    .list-label {
      color: #374151;
      font-weight: 500;
    }
    .list-value {
      font-weight: 700;
      color: #10b981;
      font-size: 18px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 8px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    .footer-text {
      color: #6b7280;
      font-size: 13px;
      margin: 5px 0;
    }
    .footer-brand {
      color: #10b981;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📊</div>
      <h1>DB Toolkit Daily Stats</h1>
      <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>

    <h2><span class="section-icon">📥</span> Downloads<span class="badge">${totalDownloads.toLocaleString()}</span></h2>
    <div class="stat-grid">
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
      <div class="stat-card">
        <div class="stat-label">Total</div>
        <div class="stat-value">${totalDownloads.toLocaleString()}</div>
      </div>
    </div>

    <h2><span class="section-icon">📈</span> Telemetry Overview<span class="badge">${totalEvents.toLocaleString()}</span></h2>
    <div class="stat-grid">
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
      <div class="stat-card">
        <div class="stat-label">Total Events</div>
        <div class="stat-value">${totalEvents.toLocaleString()}</div>
      </div>
    </div>

    <h2><span class="section-icon">🔥</span> Top Features</h2>
    <div>
      ${topFeatures.map((item, index) => `
        <div class="list-item">
          <span class="list-label">${index + 1}. ${item.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          <span class="list-value">${item.count.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>

    <h2><span class="section-icon">💾</span> Database Types</h2>
    <div>
      ${Object.entries(databaseTypes).map(([type, count]) => `
        <div class="list-item">
          <span class="list-label">${type.toUpperCase()}</span>
          <span class="list-value">${count.toLocaleString()}</span>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p class="footer-text">This is an automated daily report from <span class="footer-brand">DB Toolkit</span></p>
      <p class="footer-text">© ${new Date().getFullYear()} DB Toolkit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function generateIssueReportHTML(issue) {
  const { title, description, issue_type, environment, issue_id, created_at } = issue;
  
  const badgeColors = {
    bug: '#ef4444',
    feature: '#f59e0b',
    question: '#3b82f6',
    documentation: '#10b981'
  };

  const env = environment || {};
  const timestamp = new Date(created_at).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DB Toolkit Issue Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f3f4f6;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: ${badgeColors[issue_type] || '#6b7280'};
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 15px 0;
    }
    .section {
      margin: 25px 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }
    .description {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid ${badgeColors[issue_type] || '#6b7280'};
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .meta {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
    }
    .meta-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .meta-item:last-child {
      border-bottom: none;
    }
    .meta-label {
      font-weight: 600;
      color: #6b7280;
    }
    .meta-value {
      color: #111827;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">${issue_type}</span>
      <div class="title">${title}</div>
    </div>
    
    <div class="section">
      <div class="section-title">Description</div>
      <div class="description">${description}</div>
    </div>
    
    <div class="section">
      <div class="section-title">Environment Details</div>
      <div class="meta">
        <div class="meta-item">
          <span class="meta-label">Operating System</span>
          <span class="meta-value">${env.os || 'Unknown'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">App Version</span>
          <span class="meta-value">${env.version || 'Unknown'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Issue ID</span>
          <span class="meta-value">${issue_id}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Reported At</span>
          <span class="meta-value">${timestamp} UTC</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This issue was reported from DB Toolkit</p>
      <p>© ${new Date().getFullYear()} DB Toolkit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
}

