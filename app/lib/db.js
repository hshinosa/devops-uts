import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'devops_user',
  database: process.env.DB_NAME || 'todo_app',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Only add password if it's defined and not empty
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD !== '""') {
  dbConfig.password = process.env.DB_PASSWORD;
}

const pool = mysql.createPool(dbConfig);

export async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    if (connection) connection.release();
  }
}

export default pool;
