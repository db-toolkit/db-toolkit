/**
 * IPC handlers for issue reporting.
 */

const { ipcMain } = require('electron');
const { logger } = require('../utils/logger.js');

const API_URL = 'https://db-toolkit.vercel.app/api/issues/report';

function registerIssuesHandlers() {
  ipcMain.handle('issues:create', async (event, issue) => {
    try {
      const newIssue = {
        id: `issue_${Date.now()}`,
        title: issue.title,
        description: issue.description,
        issue_type: issue.issue_type,
        environment: issue.environment,
        status: 'open',
        created_at: new Date().toISOString()
      };
      
      logger.info(`Reporting issue: ${newIssue.id} - ${issue.title}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      logger.info(`Issue reported successfully: ${newIssue.id}`);
      
      return { success: true, issue: newIssue };
    } catch (error) {
      logger.error('Failed to report issue:', error);
      return { success: false, error: error.message };
    }
  });
}

module.exports = { registerIssuesHandlers };
