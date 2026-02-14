/**
 * MongoDB database connector.
 */

const { MongoClient } = require('mongodb');
const BaseConnector = require('./base');
const { logger } = require('../utils/logger');

class MongoDBConnector extends BaseConnector {
  async connect(config) {
    try {
      let uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port || 27017}`;
      
      if (config.ssl_enabled) {
        uri += '?tls=true';
        if (config.ssl_mode === 'require') {
          uri += '&tlsAllowInvalidCertificates=true';
        }
      }

      this.connection = new MongoClient(uri);
      await this.connection.connect();
      await this.connection.db('admin').command({ ping: 1 });
      this.isConnected = true;
      logger.info('MongoDB connection established');
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error(`MongoDB connection failed: ${error.message}`);
      return false;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.close();
        logger.info('MongoDB connection closed');
      }
      this.isConnected = false;
      return true;
    } catch (error) {
      logger.error(`Error closing MongoDB connection: ${error.message}`);
      return false;
    }
  }

  async testConnection(config) {
    try {
      let uri = `mongodb://${config.username}:${config.password}@${config.host}:${config.port || 27017}`;
      
      if (config.ssl_enabled) {
        uri += '?tls=true';
        if (config.ssl_mode === 'require') {
          uri += '&tlsAllowInvalidCertificates=true';
        }
      }

      const client = new MongoClient(uri);
      await client.connect();
      await client.db('admin').command({ ping: 1 });
      await client.close();
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getSchemas() {
    const admin = this.connection.db('admin');
    const { databases } = await admin.admin().listDatabases();
    return databases
      .map(db => db.name)
      .filter(name => !['admin', 'local', 'config'].includes(name));
  }

  async getTables(schema = null) {
    if (!schema) return [];
    const db = this.connection.db(schema);
    const collections = await db.listCollections().toArray();
    return collections.map(col => col.name);
  }

  async getColumns(table, schema = null) {
    if (!schema) return [];
    
    const db = this.connection.db(schema);
    const collection = db.collection(table);
    const sample = await collection.findOne();
    
    if (!sample) return [];
    
    return Object.keys(sample).map(key => ({
      column_name: key,
      data_type: typeof sample[key],
      is_nullable: 'YES',
      column_default: null,
    }));
  }

  async executeQuery(query, database = null, collection = null) {
    try {
      // Parse query - support JSON filter or MongoDB shell-like syntax
      let filter = {};
      let options = { limit: 100 };
      
      if (query.trim().startsWith('{')) {
        filter = JSON.parse(query);
      } else if (query.trim().startsWith('db.')) {
        // Parse db.collection.find() syntax
        const match = query.match(/db\.(\w+)\.find\((.*?)\)/);
        if (match) {
          collection = match[1];
          if (match[2]) {
            filter = JSON.parse(match[2] || '{}');
          }
        }
      }
      
      // Determine which database to use
      let db;
      if (database) {
        db = this.connection.db(database);
      } else {
        const dbList = await this.getSchemas();
        if (dbList.length === 0) {
          return { success: false, error: 'No database available' };
        }
        db = this.connection.db(dbList[0]);
      }
      
      // Determine which collection to use
      let coll;
      if (collection) {
        coll = db.collection(collection);
      } else {
        const collections = await db.listCollections().toArray();
        if (collections.length === 0) {
          return { success: false, error: 'No collections found' };
        }
        coll = db.collection(collections[0].name);
      }
      
      const documents = await coll.find(filter).limit(options.limit).toArray();
      
      if (documents.length > 0) {
        const allKeys = new Set();
        documents.forEach(doc => {
          Object.keys(doc).forEach(key => allKeys.add(key));
        });
        
        const columns = Array.from(allKeys);
        const data = documents.map(doc => 
          columns.map(col => {
            const val = doc[col];
            if (val === null || val === undefined) return '';
            if (typeof val === 'object') return JSON.stringify(val);
            return String(val);
          })
        );
        
        return {
          success: true,
          columns,
          data,
          row_count: documents.length,
        };
      }
      
      return { success: true, columns: [], data: [], row_count: 0 };
    } catch (error) {
      logger.error(`MongoDB query error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

module.exports = MongoDBConnector;
