/**
 * Base database connector interface.
 */

class BaseConnector {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect(config) {
    throw new Error('connect() must be implemented');
  }

  async disconnect() {
    throw new Error('disconnect() must be implemented');
  }

  async testConnection(config) {
    throw new Error('testConnection() must be implemented');
  }

  async getSchemas() {
    throw new Error('getSchemas() must be implemented');
  }

  async getTables(schema = null) {
    throw new Error('getTables() must be implemented');
  }

  async getColumns(table, schema = null) {
    throw new Error('getColumns() must be implemented');
  }

  async executeQuery(query) {
    throw new Error('executeQuery() must be implemented');
  }
}

module.exports = BaseConnector;
