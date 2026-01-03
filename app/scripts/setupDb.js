const mysql = require('mysql2/promise');

async function setup() {
  console.log('🔧 Setting up database...');
  
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'todo_devops',
    port: 8111,
  });

  console.log('✅ Connected to database');

  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        color VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Categories table created');

    // Create tasks table
    await connection.execute(`
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
        INDEX idx_user_status (user_id, status),
        INDEX idx_due_date (due_date)
      )
    `);
    console.log('✅ Tasks table created');

    // Create task_sharing table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS task_sharing (
        id INT PRIMARY KEY AUTO_INCREMENT,
        task_id INT NOT NULL,
        shared_with_user_id INT NOT NULL,
        permission ENUM('view', 'edit') DEFAULT 'view',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Task_sharing table created');

    // Create activity_log table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        task_id INT,
        action VARCHAR(50),
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Activity_log table created');

    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setup();
