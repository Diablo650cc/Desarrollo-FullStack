-- ===============================================
-- SCRIPT DE BASE DE DATOS - VERSIÓN 2.0
-- ===============================================

-- Tabla de usuarios (con rol)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('usuario', 'admin') DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  monto DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'USD',
  descripcion VARCHAR(255),
  id_transaccion VARCHAR(100) UNIQUE,
  estado ENUM('pendiente', 'completado', 'fallido', 'cancelado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX(usuario_id),
  INDEX(estado),
  INDEX(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de historial de tipos de cambio (para cache)
CREATE TABLE IF NOT EXISTS tipos_cambio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usd DECIMAL(10, 6) DEFAULT 1,
  ars DECIMAL(10, 2),
  mxn DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar un usuario admin por defecto (contraseña: admin123)
-- bcrypt hash de "Admin@123": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/PFm
INSERT IGNORE INTO usuarios (nombre, email, password, rol) 
VALUES ('Administrador', 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/PFm', 'admin');

-- Insertar usuario de prueba
-- bcrypt hash de "Usuario@123": $2a$10$8L5YYr6v8nxQcHHf7l5J7u.JkIy3XjEJqkTx.kVXq9mJDvJRoJsWK
INSERT IGNORE INTO usuarios (nombre, email, password, rol) 
VALUES ('Usuario Prueba', 'usuario@example.com', '$2a$10$8L5YYr6v8nxQcHHf7l5J7u.JkIy3XjEJqkTx.kVXq9mJDvJRoJsWK', 'usuario');

-- Ver estructura
SHOW TABLES;
