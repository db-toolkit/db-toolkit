/**
 * Schema exploration operations.
 */

const { connectionManager } = require('../utils/connection-manager');
const { schemaCache } = require('../utils/cache');
const { CACHE_TTL } = require('../utils/constants');
const { logger } = require('../utils/logger.js');

class SchemaExplorer {
  async getSchemaTree(connection, useCache = true) {
    const cacheKey = `${connection.id}_schema`;

    logger.info(`Getting schema tree for connection '${connection.name}' (use_cache=${useCache})`);

    if (useCache) {
      const cached = schemaCache.get(cacheKey);
      if (cached) {
        logger.info(`Returning cached schema for '${connection.name}'`);
        return cached;
      }
    }

    try {
      let connector = await connectionManager.getConnector(connection.id);
      if (!connector) {
        const success = await connectionManager.connect(connection);
        if (!success) {
          throw new Error('Failed to establish database connection');
        }
        connector = await connectionManager.getConnector(connection.id);
        if (!connector) {
          throw new Error('Connection manager failed to provide connector');
        }
      }

      const schemaTree = {
        connection_id: connection.id,
        db_type: connection.db_type,
        schemas: {},
      };

      const schemas = await connector.getSchemas();
      logger.info(`Found ${schemas.length} schemas:`, schemas);

      for (const schemaName of schemas) {
        const tables = await connector.getTables(schemaName);
        logger.info(`Schema '${schemaName}' has ${tables.length} tables:`, tables);
        schemaTree.schemas[schemaName] = {
          tables: {},
          table_count: tables.length,
        };

        for (const tableName of tables) {
          const columns = await connector.getColumns(tableName, schemaName);
          schemaTree.schemas[schemaName].tables[tableName] = {
            columns,
            column_count: columns.length,
          };
        }
      }

      schemaCache.set(cacheKey, schemaTree, CACHE_TTL.SCHEMA_TREE);
      return schemaTree;
    } catch (error) {
      logger.error(`Failed to get schema tree for '${connection.name}':`, error);
      return { error: error.message, success: false };
    }
  }

  async getTableInfo(connection, schema, table) {
    const cacheKey = `${connection.id}_table_${schema}_${table}`;
    const cached = schemaCache.get(cacheKey);
    if (cached) return cached;

    try {
      let connector = await connectionManager.getConnector(connection.id);
      if (!connector) {
        const success = await connectionManager.connect(connection);
        if (!success) {
          throw new Error('Failed to establish database connection');
        }
        connector = await connectionManager.getConnector(connection.id);
        if (!connector) {
          throw new Error('Connection manager failed to provide connector');
        }
      }

      const columns = await connector.getColumns(table, schema);

      const sampleQuery = this.buildSampleQuery(connection.db_type, schema, table);
      const sampleResult = await connector.executeQuery(sampleQuery);

      const tableInfo = {
        success: true,
        table,
        schema,
        columns,
        sample_data: sampleResult.success ? (sampleResult.data || []).slice(0, 5) : [],
      };

      schemaCache.set(cacheKey, tableInfo, CACHE_TTL.TABLE_INFO);
      return tableInfo;
    } catch (error) {
      logger.error(`Failed to get table info for '${connection.name}.${schema}.${table}':`, error);
      return { success: false, error: error.message };
    }
  }

  buildSampleQuery(dbType, schema, table) {
    if (dbType === 'mongodb') {
      return '{}';
    } else if (dbType === 'sqlite') {
      return `SELECT * FROM "${table}" LIMIT 5`;
    } else {
      return `SELECT * FROM ${schema}."${table}" LIMIT 5`;
    }
  }

  async refreshSchema(connectionId) {
    const keysToRemove = schemaCache.getKeys().filter(key => key.startsWith(`${connectionId}_`));
    keysToRemove.forEach(key => schemaCache.delete(key));
  }

  getCachedSchemas() {
    return schemaCache.getKeys();
  }
}

const schemaExplorer = new SchemaExplorer();

module.exports = { SchemaExplorer, schemaExplorer, schemaCache };
