const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createDemoUser() {
  console.log('🔧 Creating demo user...');
  
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'todo_devops',
    port: 8111,
  });

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert demo user
    await connection.execute(`
      INSERT INTO users (username, email, password, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE password = ?
    `, ['admin', 'admin@todo-app.com', hashedPassword, hashedPassword]);
    
    console.log('✅ Demo user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    // Verify user exists
    const [users] = await connection.execute('SELECT id, username, email FROM users WHERE username = ?', ['admin']);
    console.log('\n📋 User in database:', users[0]);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

createDemoUser();
