const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Middleware para autenticación (verifica JWT válido)
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

/**
 * Middleware para autorización basada en roles
 * @param {string|array} rolesRequeridos - Rol(es) requerido(s)
 */
function checkRole(...rolesRequeridos) {
  return async (req, res, next) => {
    try {
      const [usuarios] = await pool.query(
        'SELECT rol FROM usuarios WHERE id = ?',
        [req.usuario.id]
      );

      if (usuarios.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const rolUsuario = usuarios[0].rol;

      if (!rolesRequeridos.includes(rolUsuario)) {
        return res.status(403).json({
          message: 'No tienes permisos para acceder a este recurso',
          rolRequired: rolesRequeridos,
          rolActual: rolUsuario
        });
      }

      next();
    } catch (error) {
      console.error('Error en checkRole:', error);
      res.status(500).json({ message: 'Error en la validación de permisos' });
    }
  };
}

/**
 * Middleware para verificar que el usuario solo acceda a su propio perfil
 * o sea admin
 */
async function checkOwnerOrAdmin(req, res, next) {
  try {
    const [usuarios] = await pool.query(
      'SELECT rol FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    const usuarioActual = usuarios[0];
    const idEnRuta = parseInt(req.params.id);

    if (usuarioActual.rol !== 'admin' && req.usuario.id !== idEnRuta) {
      return res.status(403).json({
        message: 'No tienes permisos para acceder a este recurso'
      });
    }

    next();
  } catch (error) {
    console.error('Error en checkOwnerOrAdmin:', error);
    res.status(500).json({ message: 'Error en la validación de permisos' });
  }
}

module.exports = {
  authMiddleware,
  checkRole,
  checkOwnerOrAdmin
};
