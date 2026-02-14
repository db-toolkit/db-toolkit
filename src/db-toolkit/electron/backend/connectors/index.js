/**
 * Database connectors module exports.
 */

const BaseConnector = require('./base');
const PostgreSQLConnector = require('./postgresql');
const MySQLConnector = require('./mysql');
const MariaDBConnector = require('./mariadb');
const SQLiteConnector = require('./sqlite');
const MongoDBConnector = require('./mongodb');
const ConnectorFactory = require('./factory');

module.exports = {
  BaseConnector,
  PostgreSQLConnector,
  MySQLConnector,
  MariaDBConnector,
  SQLiteConnector,
  MongoDBConnector,
  ConnectorFactory,
};
