/**
 * MySQL database connector.
 */

const mysql = require('mysql2/promise');
const BaseConnector = require('./base');
const { logger } = require('../utils/logger');

class MySQLConnector extends BaseConnector {
  async connect(config) {
    try {
      const connConfig = {
        host: config.host,
        port: config.port || 3306,
        user: config.username,
        password: config.password,
        database: config.database,
      };

      if (config.ssl_enabled) {
        connConfig.ssl = {
          rejectUnauthorized: config.ssl_mode === 'verify-full' || config.ssl_mode === 'verify-ca',
        };
      }

      this.connection = await mysql.createConnection(connConfig);
      this.isConnected = true;
      logger.info('MySQL connection established');
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error(`MySQL connection failed: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.end();
        logger.info('MySQL connection closed');
      }
      this.isConnected = false;
      return true;
    } catch (error) {
      logger.error(`Error closing MySQL connection: ${error.message}`);
      return false;
    }
  }

  async testConnection(config) {
    try {
      const connConfig = {
        host: config.host,
        port: config.port || 3306,
        user: config.username,
        password: config.password,
        database: config.database,
      };

      if (config.ssl_enabled) {
        connConfig.ssl = {
          rejectUnauthorized: config.ssl_mode === 'verify-full' || config.ssl_mode === 'verify-ca',
        };
      }

      const conn = await mysql.createConnection(connConfig);
      await conn.end();
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getSchemas() {
    const [rows] = await this.connection.query('SHOW DATABASES');
    return rows
      .map(row => Object.values(row)[0])
      .filter(db => !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(db));
  }

  async getTables(schema = null) {
    if (schema) {
      await this.connection.query(`USE ${schema}`);
    }
    const [rows] = await this.connection.query('SHOW TABLES');
    return rows.map(row => Object.values(row)[0]);
  }

  async getColumns(table, schema = null) {
    if (schema) {
      await this.connection.query(`USE ${schema}`);
    }
    const [rows] = await this.connection.query(`DESCRIBE ${table}`);
    return rows.map(row => ({
      column_name: row.Field,
      data_type: row.Type,
      is_nullable: row.Null === 'YES' ? 'YES' : 'NO',
      column_default: row.Default,
    }));
  }

  async executeQuery(query) {
    try {
      const [rows, fields] = await this.connection.query(query);
      if (Array.isArray(rows) && rows.length > 0) {
        const columns = fields.map(f => f.name);
        const data = rows.map(row => Object.values(row));
        return {
          success: true,
          columns,
          data,
          row_count: rows.length,
        };
      }
      return { success: true, columns: [], data: [], row_count: 0 };
    } catch (error) {
      logger.error(`MySQL query error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = MySQLConnector;
