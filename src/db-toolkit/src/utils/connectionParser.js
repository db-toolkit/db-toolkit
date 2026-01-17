export function parseConnectionUrl(url) {
  if (!url.trim()) {
    throw new Error('Database URL is required');
  }

  // Handle SQLite special case
  if (url.startsWith('sqlite:///')) {
    const filePath = url.replace('sqlite:///', '');
    return {
      db_type: 'sqlite',
      database: filePath,
      host: '',
      port: 0,
      username: '',
      password: '',
      ssl_enabled: false,
      ssl_mode: 'require',
    };
  }

  const urlObj = new URL(url);
  let protocol = urlObj.protocol.replace(':', '');
  
  // Handle async protocols
  const asyncProtocols = {
    'postgresql+asyncpg': 'postgresql',
    'postgres+asyncpg': 'postgresql',
    'mysql+aiomysql': 'mysql',
    'mongodb+srv': 'mongodb',
  };
  
  let dbType = asyncProtocols[protocol] || protocol;
  if (dbType === 'postgres') dbType = 'postgresql';
  
  // Validate supported database type
  if (!['postgresql', 'mysql', 'mongodb', 'sqlite'].includes(dbType)) {
    throw new Error(`Unsupported database type: ${protocol}`);
  }

  const defaultPorts = {
    postgresql: 5432,
    mysql: 3306,
    mongodb: 27017,
  };

  const database = urlObj.pathname.replace('/', '');
  if (!database) {
    throw new Error('Database name is required in URL');
  }

  // Parse SSL parameters from query string
  const searchParams = urlObj.searchParams;
  let ssl_enabled = false;
  let ssl_mode = 'require';

  // Check for SSL/TLS parameters
  if (searchParams.has('ssl') || searchParams.has('tls') || searchParams.has('sslmode')) {
    const sslParam = searchParams.get('ssl') || searchParams.get('tls');
    const sslModeParam = searchParams.get('sslmode');
    
    if (sslParam === 'true' || sslParam === '1' || sslModeParam) {
      ssl_enabled = true;
      ssl_mode = sslModeParam || 'require';
    }
  }
  
  return {
    db_type: dbType,
    host: urlObj.hostname || 'localhost',
    port: parseInt(urlObj.port) || defaultPorts[dbType] || 0,
    database,
    username: urlObj.username || '',
    password: urlObj.password || '',
    ssl_enabled,
    ssl_mode,
  };
}
