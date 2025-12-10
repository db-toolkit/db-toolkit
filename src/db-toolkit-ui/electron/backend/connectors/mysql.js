/**
 * MySQL database connector.
 */

const mysql = require('mysql2/promise');
const BaseConnector = require('./base');

class MySQLConnector extends BaseConnector {
  async connect(config) {
    try {
      this.connection = await mysql.createConnection({
        host: config.host,
        port: config.port || 3306,
        user: config.username,
        password: config.password,
        database: config.database,
      });
      this.isConnected = true;
      return true;
    } catch (error) {
      this.isConnected = false;
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.end();
      }
      this.isConnected = false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async testConnection(config) {
    try {
      const conn = await mysql.createConnection({
        host: config.host,
        port: config.port || 3306,
        user: config.username,
        password: config.password,
        database: config.database,
      });
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
      return { success: false, error: error.message };
    }
  }
}

module.exports = MySQLConnector;
