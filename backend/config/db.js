const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }, // <-- AQUÍ FALTABA LA COMA
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado exitosamente a MySQL en Aiven');
    conn.release();
  })
  .catch(err => console.error('❌ Error de conexión a la BD:', err.message));

module.exports = pool;