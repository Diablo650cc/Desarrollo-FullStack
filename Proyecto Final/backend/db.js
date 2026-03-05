const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'proyecto_api';

let pool;

async function initDatabase() {
    const adminPool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        waitForConnections: true,
        connectionLimit: 10
    });

    await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await adminPool.end();

    pool = mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(120) NOT NULL,
            descripcion TEXT,
            categoria VARCHAR(80) NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            talla VARCHAR(30),
            color VARCHAR(30),
            stock INT NOT NULL DEFAULT 0,
            usuario_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_products_users FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    return pool;
}

function getPool() {
    if (!pool) {
        throw new Error('Database pool no inicializado');
    }
    return pool;
}

module.exports = {
    initDatabase,
    getPool
};
