/**
 * MariaDB database connector.
 * Extends MySQL connector with MariaDB-specific handling.
 */

const MySQLConnector = require('./mysql');
const { logger } = require('../utils/logger');

class MariaDBConnector extends MySQLConnector {
  async getSchemas() {
    const [rows] = await this.connection.query('SHOW DATABASES');
    return rows
      .map(row => Object.values(row)[0])
      .filter(db => !['information_schema', 'performance_schema', 'mysql', 'sys', 'phpmyadmin'].includes(db));
  }

  async testConnection() {
    try {
      await this.connection.query('SELECT VERSION() as version');
      logger.info('MariaDB connection test successful');
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      logger.error(`MariaDB connection test failed: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}

module.exports = MariaDBConnector;
