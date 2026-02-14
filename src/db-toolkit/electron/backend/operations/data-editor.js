/**
 * Data editing operations.
 */

const { ConnectorFactory } = require('../connectors');
const { logger } = require('../utils/logger.js');

class DataEditor {
  async updateRow(connection, table, schemaName, primaryKey, changes) {
    if (!primaryKey || Object.keys(primaryKey).length === 0) {
      return { success: false, error: 'Primary key required for update' };
    }

    if (!changes || Object.keys(changes).length === 0) {
      return { success: false, error: 'No changes provided' };
    }

    try {
      const connector = ConnectorFactory.createConnector(connection.db_type);
      await connector.connect(connection);

      let result;
      if (connection.db_type === 'mongodb') {
        result = await this.updateMongoDB(connector, table, primaryKey, changes, schemaName);
      } else {
        result = await this.updateSQL(connector, table, schemaName, primaryKey, changes, connection.db_type);
      }

      await connector.disconnect();
      return result;
    } catch (error) {
      logger.error(`Update row failed on '${connection.name}.${table}':`, error);
      return { success: false, error: error.message };
    }
  }

  async insertRow(connection, table, schemaName, data) {
    if (!data || Object.keys(data).length === 0) {
      return { success: false, error: 'No data provided' };
    }

    try {
      const connector = ConnectorFactory.createConnector(connection.db_type);
      await connector.connect(connection);

      let result;
      if (connection.db_type === 'mongodb') {
        result = await this.insertMongoDB(connector, table, data, schemaName);
      } else {
        result = await this.insertSQL(connector, table, schemaName, data, connection.db_type);
      }

      await connector.disconnect();
      return result;
    } catch (error) {
      logger.error(`Insert row failed on '${connection.name}.${table}':`, error);
      return { success: false, error: error.message };
    }
  }

  async deleteRow(connection, table, schemaName, primaryKey) {
    if (!primaryKey || Object.keys(primaryKey).length === 0) {
      return { success: false, error: 'Primary key required for delete' };
    }

    try {
      const connector = ConnectorFactory.createConnector(connection.db_type);
      await connector.connect(connection);

      let result;
      if (connection.db_type === 'mongodb') {
        result = await this.deleteMongoDB(connector, table, primaryKey, schemaName);
      } else {
        result = await this.deleteSQL(connector, table, schemaName, primaryKey, connection.db_type);
      }

      await connector.disconnect();
      return result;
    } catch (error) {
      logger.error(`Delete row failed on '${connection.name}.${table}':`, error);
      return { success: false, error: error.message };
    }
  }

  async updateSQL(connector, table, schema, primaryKey, changes, dbType) {
    const quoteChar = (dbType === 'mysql' || dbType === 'mariadb') ? '`' : '"';
    
    const setClause = Object.entries(changes)
      .map(([col, val]) => `${quoteChar}${col}${quoteChar} = '${val}'`)
      .join(', ');
    const whereClause = Object.entries(primaryKey)
      .map(([col, val]) => `${quoteChar}${col}${quoteChar} = '${val}'`)
      .join(' AND ');

    let query;
    if (schema && schema !== 'main' && schema !== 'public') {
      query = `UPDATE ${quoteChar}${schema}${quoteChar}.${quoteChar}${table}${quoteChar} SET ${setClause} WHERE ${whereClause}`;
    } else {
      query = `UPDATE ${quoteChar}${table}${quoteChar} SET ${setClause} WHERE ${whereClause}`;
    }

    const result = await connector.executeQuery(query);

    if (result.success) {
      return { success: true, message: 'Row updated successfully' };
    } else {
      return { success: false, error: result.error || 'Update failed' };
    }
  }

  async insertSQL(connector, table, schema, data, dbType) {
    const quoteChar = (dbType === 'mysql' || dbType === 'mariadb') ? '`' : '"';
    
    const columns = Object.keys(data).map(col => `${quoteChar}${col}${quoteChar}`).join(', ');
    const values = Object.values(data).map(val => `'${val}'`).join(', ');

    let query;
    if (schema && schema !== 'main' && schema !== 'public') {
      query = `INSERT INTO ${quoteChar}${schema}${quoteChar}.${quoteChar}${table}${quoteChar} (${columns}) VALUES (${values})`;
    } else {
      query = `INSERT INTO ${quoteChar}${table}${quoteChar} (${columns}) VALUES (${values})`;
    }

    logger.info(`Insert query (${dbType}): ${query}`);
    const result = await connector.executeQuery(query);

    if (result.success) {
      return { success: true, message: 'Row inserted successfully' };
    } else {
      return { success: false, error: result.error || 'Insert failed' };
    }
  }

  async deleteSQL(connector, table, schema, primaryKey, dbType) {
    const quoteChar = (dbType === 'mysql' || dbType === 'mariadb') ? '`' : '"';
    
    const whereClause = Object.entries(primaryKey)
      .map(([col, val]) => `${quoteChar}${col}${quoteChar} = '${val}'`)
      .join(' AND ');

    let query;
    if (schema && schema !== 'main' && schema !== 'public') {
      query = `DELETE FROM ${quoteChar}${schema}${quoteChar}.${quoteChar}${table}${quoteChar} WHERE ${whereClause}`;
    } else {
      query = `DELETE FROM ${quoteChar}${table}${quoteChar} WHERE ${whereClause}`;
    }

    const result = await connector.executeQuery(query);

    if (result.success) {
      return { success: true, message: 'Row deleted successfully' };
    } else {
      return { success: false, error: result.error || 'Delete failed' };
    }
  }

  async updateMongoDB(connector, collection, filterDoc, changes, database) {
    try {
      const db = database ? connector.connection.db(database) : connector.connection.db();
      const coll = db.collection(collection);
      const result = await coll.updateOne(filterDoc, { $set: changes });

      if (result.modifiedCount > 0) {
        return { success: true, message: 'Document updated successfully' };
      } else {
        return { success: false, error: 'No document matched the filter' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async insertMongoDB(connector, collection, data, database) {
    try {
      const db = database ? connector.connection.db(database) : connector.connection.db();
      const coll = db.collection(collection);
      const result = await coll.insertOne(data);

      return {
        success: true,
        message: 'Document inserted successfully',
        id: result.insertedId.toString(),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteMongoDB(connector, collection, filterDoc, database) {
    try {
      const db = database ? connector.connection.db(database) : connector.connection.db();
      const coll = db.collection(collection);
      const result = await coll.deleteOne(filterDoc);

      if (result.deletedCount > 0) {
        return { success: true, message: 'Document deleted successfully' };
      } else {
        return { success: false, error: 'No document matched the filter' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

const dataEditor = new DataEditor();

module.exports = { DataEditor, dataEditor };
