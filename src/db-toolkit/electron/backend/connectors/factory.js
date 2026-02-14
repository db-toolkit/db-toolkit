/**
 * Connector factory for creating database connectors.
 */

const PostgreSQLConnector = require('./postgresql');
const MySQLConnector = require('./mysql');
const MariaDBConnector = require('./mariadb');
const SQLiteConnector = require('./sqlite');
const MongoDBConnector = require('./mongodb');

const connectors = {
  postgresql: PostgreSQLConnector,
  mysql: MySQLConnector,
  mariadb: MariaDBConnector,
  sqlite: SQLiteConnector,
  mongodb: MongoDBConnector,
};

class ConnectorFactory {
  static createConnector(dbType) {
    const ConnectorClass = connectors[dbType.toLowerCase()];
    if (!ConnectorClass) {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
    return new ConnectorClass();
  }

  static getSupportedTypes() {
    return Object.keys(connectors);
  }
}

module.exports = ConnectorFactory;
