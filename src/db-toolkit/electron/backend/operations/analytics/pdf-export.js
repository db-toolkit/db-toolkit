/**
 * PDF export for analytics metrics.
 */

const fs = require('fs').promises;
const path = require('path');
const { BrowserWindow } = require('electron');

async function generateAnalyticsPDF(connectionName, metrics, historicalData, slowQueries, tableStats) {
  // Read HTML template
  const templatePath = path.join(__dirname, '../../templates/analytics-report.html');
  let html = await fs.readFile(templatePath, 'utf-8');
  // Replace placeholders
  html = html.replace('{{CONNECTION_NAME}}', escapeHtml(connectionName));
  html = html.replace('{{TIMESTAMP}}', new Date().toLocaleString());
  html = html.replace('{{ACTIVE_CONNECTIONS}}', metrics.active_connections || 0);
  html = html.replace('{{IDLE_CONNECTIONS}}', metrics.idle_connections || 0);
  html = html.replace('{{DATABASE_SIZE}}', formatBytes(metrics.database_size || 0));
  html = html.replace('{{TOTAL_TABLES}}', tableStats?.length || 0);
  
  // Query stats
  const queryStats = metrics.query_stats || {};
  const queryStatsHtml = Object.entries(queryStats)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `
      <p style="margin: 5px 0; color: #4b5563; font-size: 14px;"><strong>${escapeHtml(type)}:</strong> ${count}</p>
    `).join('');
  html = html.replace('{{QUERY_STATS}}', queryStatsHtml || '<p style="color: #6b7280; font-size: 14px;">No query statistics available</p>');
  
  // Current queries
  const currentQueries = metrics.current_queries || [];
  const currentQueriesHtml = currentQueries.slice(0, 10).map(q => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${q.pid || 'N/A'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(q.usename || q.user || 'N/A')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatDuration(q.duration || 0)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: 'Courier New', monospace; font-size: 11px; color: #4b5563;">${escapeHtml(truncateText(q.query, 80))}</td>
    </tr>
  `).join('');
  html = html.replace('{{CURRENT_QUERIES}}', currentQueriesHtml || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #6b7280;">No active queries</td></tr>');
  
  // Slow queries
  const slowQueriesHtml = (slowQueries || []).slice(0, 20).map(q => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${q.timestamp?.slice(0, 19) || 'N/A'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatDuration(q.duration)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-family: 'Courier New', monospace; font-size: 11px; color: #4b5563;">${escapeHtml(truncateText(q.query, 80))}</td>
    </tr>
  `).join('');
  html = html.replace('{{SLOW_QUERIES}}', slowQueriesHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #6b7280;">No slow queries recorded</td></tr>');
  
  // Table stats
  const tableStatsHtml = (tableStats || []).slice(0, 20).map(t => {
    const tableName = t.tablename || t.table_name || t.collection || 'N/A';
    const size = typeof t.size === 'number' ? formatBytes(t.size) : t.size || 'N/A';
    const rows = t.row_count || t.n_live_tup || 0;
    const indexSize = t.index_size ? formatBytes(t.index_size) : 'N/A';
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(tableName)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${size}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${rows.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
  html = html.replace('{{TABLE_STATS}}', tableStatsHtml || '<tr><td colspan="3" style="padding: 12px; text-align: center; color: #6b7280;">No table statistics available</td></tr>');
  
  // Historical summary
  let historicalSummary = 'No historical data available';
  if (historicalData && historicalData.length > 0) {
    const latest = historicalData[historicalData.length - 1];
    historicalSummary = `${historicalData.length} data points collected. Latest: ${latest.active_connections || 0} active connections, ${formatBytes(latest.database_size || 0)} database size`;
  }
  html = html.replace('{{HISTORICAL_SUMMARY}}', historicalSummary);
  
  // Convert HTML to PDF using Electron
  const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  
  const pdfBuffer = await win.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 }
  });
  
  win.close();
  return pdfBuffer;
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
}

function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = { generateAnalyticsPDF };
