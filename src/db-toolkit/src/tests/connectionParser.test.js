import { parseConnectionUrl } from '../utils/connectionParser';

const tests = [
  // MongoDB without credentials
  {
    name: 'MongoDB without credentials',
    input: 'mongodb://127.0.0.1:27017/truelovedb',
    expected: { db_type: 'mongodb', host: '127.0.0.1', port: 27017, database: 'truelovedb', username: '', password: '' }
  },
  // MongoDB with credentials
  {
    name: 'MongoDB with credentials',
    input: 'mongodb://admin:password@127.0.0.1:27017/mydb',
    expected: { db_type: 'mongodb', host: '127.0.0.1', port: 27017, database: 'mydb', username: 'admin', password: 'password' }
  },
  // MongoDB+srv
  {
    name: 'MongoDB+srv',
    input: 'mongodb+srv://user:pass@cluster.mongodb.net/mydb',
    expected: { db_type: 'mongodb', database: 'mydb', username: 'user', password: 'pass' }
  },
  // PostgreSQL
  {
    name: 'PostgreSQL',
    input: 'postgresql://user:pass@localhost:5432/mydb',
    expected: { db_type: 'postgresql', host: 'localhost', port: 5432, database: 'mydb', username: 'user', password: 'pass' }
  },
  // postgres:// alias
  {
    name: 'postgres:// alias',
    input: 'postgres://user:pass@localhost:5432/mydb',
    expected: { db_type: 'postgresql', host: 'localhost', port: 5432, database: 'mydb' }
  },
  // MySQL
  {
    name: 'MySQL',
    input: 'mysql://user:pass@localhost:3306/mydb',
    expected: { db_type: 'mysql', host: 'localhost', port: 3306, database: 'mydb' }
  },
  // SQLite
  {
    name: 'SQLite',
    input: 'sqlite:///home/user/mydb.sqlite',
    expected: { db_type: 'sqlite', database: '/home/user/mydb.sqlite' }
  },
  // PostgreSQL with SSL
  {
    name: 'PostgreSQL with SSL',
    input: 'postgresql://user:pass@localhost:5432/mydb?sslmode=require',
    expected: { db_type: 'postgresql', ssl_enabled: true, ssl_mode: 'require' }
  },
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, input, expected }) => {
  try {
    const result = parseConnectionUrl(input);
    const failures = Object.entries(expected).filter(([key, val]) => result[key] !== val);
    
    if (failures.length === 0) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failures.forEach(([key, val]) => {
        console.log(`   Expected ${key}: ${val}, got: ${result[key]}`);
      });
      failed++;
    }
  } catch (err) {
    console.log(`❌ ${name} - threw error: ${err.message}`);
    failed++;
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
