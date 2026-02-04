/**
 * IPC handlers for issue reporting.
 */

const { ipcMain } = require('electron');
const { logger } = require('../utils/logger.js');

const API_URL = 'https://db-toolkit-api.vercel.app/api/issues/report';

function registerIssuesHandlers() {
  ipcMain.handle('issues:create', async (event, issue) => {
    try {
      const issueData = {
        title: issue.title,
        description: issue.description,
        issue_type: issue.issue_type,
        environment: issue.environment,
        issue_id: `issue_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      logger.info(`Reporting issue: ${issueData.issue_id} - ${issue.title}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueData)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      logger.info(`Issue reported successfully: ${issueData.issue_id}`);
      
      return { success: true, issue: issueData };
    } catch (error) {
      logger.error('Failed to report issue:', error);
      return { success: false, error: error.message };
    }
  });
}

module.exports = { registerIssuesHandlers };
