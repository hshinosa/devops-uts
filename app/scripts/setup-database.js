import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  
  let connection;
  try {
    // Connect to MySQL without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✓ Connected to MySQL');

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'todo_devops';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✓ Database '${dbName}' created/verified`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);
    console.log(`✓ Using database '${dbName}'`);

    await connection.end();

    // Initialize tables
    console.log('🔧 Initializing tables...');
    await createTables(connection);
    console.log('✓ Tables initialized');

    // Insert sample data
    console.log('🔧 Inserting sample data...');
    await insertSampleData();
    console.log('✓ Sample data inserted');

    console.log('\n✅ Database setup complete!');
    console.log('🚀 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

async function createTables(connection) {
  const dbName = process.env.DB_NAME || 'todo_devops';
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: dbName,
    port: process.env.DB_PORT || 3306,
  });

  // Create users table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create categories table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      color VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create tasks table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      category_id INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
      due_date DATE,
      tags VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      INDEX idx_user_status (user_id, status),
      INDEX idx_due_date (due_date)
    )
  `);

  await conn.end();
}

async function insertSampleData() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'todo_devops',
    port: process.env.DB_PORT || 3306,
  });
  
  // Insert a default user
  try {
    await conn.execute(`
      INSERT IGNORE INTO users (id, username, email, password)
      VALUES (1, 'demo', 'demo@example.com', '$2a$10$dummy.hash.for.demo.user.only')
    `);
  } catch (e) {
    // User might already exist
  }

  // Insert sample tasks
  const sampleTasks = [
    {
      title: 'Setup Development Environment',
      description: 'Install Node.js, MySQL, and configure project',
      priority: 'high',
      status: 'completed',
      due_date: '2026-01-01'
    },
    {
      title: 'Create Database Schema',
      description: 'Design and implement database tables',
      priority: 'high',
      status: 'completed',
      due_date: '2026-01-02'
    },
    {
      title: 'Implement Dashboard Analytics',
      description: 'Create charts and statistics for task monitoring',
      priority: 'high',
      status: 'in_progress',
      due_date: '2026-01-05'
    },
    {
      title: 'Setup Kubernetes Deployment',
      description: 'Create K8s manifests for MySQL and Next.js',
      priority: 'high',
      status: 'pending',
      due_date: '2026-01-07'
    },
    {
      title: 'Write Documentation',
      description: 'Document API endpoints and deployment process',
      priority: 'medium',
      status: 'pending',
      due_date: '2026-01-10'
    },
    {
      title: 'Code Review',
      description: 'Review code quality and best practices',
      priority: 'medium',
      status: 'in_progress',
      due_date: '2026-01-08'
    },
    {
      title: 'Fix Minor Bugs',
      description: 'Address small issues found during testing',
      priority: 'low',
      status: 'pending',
      due_date: '2026-01-12'
    },
    {
      title: 'Performance Testing',
      description: 'Test application under load',
      priority: 'medium',
      status: 'pending',
      due_date: '2026-01-15'
    }
  ];

  for (const task of sampleTasks) {
    try {
      await conn.execute(`
        INSERT INTO tasks (user_id, title, description, priority, status, due_date)
        VALUES (1, ?, ?, ?, ?, ?)
      `, [task.title, task.description, task.priority, task.status, task.due_date]);
    } catch (e) {
      // Task might already exist
    }
  }

  await conn.end();
}

// Run setup
setupDatabase();
