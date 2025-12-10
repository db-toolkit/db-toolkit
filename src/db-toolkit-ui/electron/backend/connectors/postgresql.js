/**
 * PostgreSQL database connector.
 */

const { Pool } = require('pg');
const BaseConnector = require('./base');
const { logger } = require('../utils/logger');

class PostgreSQLConnector extends BaseConnector {
  async connect(config) {
    try {
      this.connection = new Pool({
        host: config.host,
        port: config.port || 5432,
        user: config.username,
        password: config.password,
        database: config.database,
      });
      await this.connection.query('SELECT 1');
      this.isConnected = true;
      logger.info('PostgreSQL connection established');
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error(`PostgreSQL connection failed: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.end();
        logger.info('PostgreSQL connection closed');
      }
      this.isConnected = false;
      return true;
    } catch (error) {
      logger.error(`Error closing PostgreSQL connection: ${error.message}`);
      return false;
    }
  }

  async testConnection(config) {
    try {
      const pool = new Pool({
        host: config.host,
        port: config.port || 5432,
        user: config.username,
        password: config.password,
        database: config.database,
      });
      await pool.query('SELECT 1');
      await pool.end();
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getSchemas() {
    const query = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name
    `;
    const result = await this.connection.query(query);
    return result.rows.map(row => row.schema_name);
  }

  async getTables(schema = 'public') {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = $1 AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    const result = await this.connection.query(query, [schema]);
    return result.rows.map(row => row.table_name);
  }

  async getColumns(table, schema = 'public') {
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = $1 AND table_name = $2
      ORDER BY ordinal_position
    `;
    const result = await this.connection.query(query, [schema, table]);
    return result.rows;
  }

  async executeQuery(query) {
    try {
      const result = await this.connection.query(query);
      if (result.rows && result.rows.length > 0) {
        const columns = Object.keys(result.rows[0]);
        const data = result.rows.map(row => Object.values(row));
        return {
          success: true,
          columns,
          data,
          row_count: result.rows.length,
        };
      }
      return { success: true, columns: [], data: [], row_count: 0 };
    } catch (error) {
      logger.error(`PostgreSQL query error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = PostgreSQLConnector;
