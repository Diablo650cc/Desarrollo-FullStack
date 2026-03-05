const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware, checkRole, checkOwnerOrAdmin } = require('../middlewares/authorization.middleware');
const { usuarioValidators } = require('../middlewares/validation.middleware');
const pool = require('../config/db');

/* 
  ========== RUTAS PÚBLICAS ==========
*/

// POST /api/usuarios/registro - Registrar nuevo usuario
router.post('/registro', usuarioValidators.registro, async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Verificar si el email ya existe
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario (rol por defecto: 'usuario')
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, 'usuario']
    );

    // Generar token JWT
    const token = jwt.sign(
      { id: result.insertId, email, rol: 'usuario' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: result.insertId,
        nombre,
        email,
        rol: 'usuario'
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// POST /api/usuarios/login - Iniciar sesión
router.post('/login', usuarioValidators.login, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [users] = await pool.query(
      'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = users[0];

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT con rol
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

/* 
  ========== RUTAS PROTEGIDAS - INFORMACIÓN PERSONAL ==========
*/

// GET /api/usuarios/perfil - Obtener perfil del usuario autenticado
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Perfil obtenido correctamente',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

// PUT /api/usuarios/perfil - Actualizar perfil del usuario autenticado
router.put('/perfil', authMiddleware, usuarioValidators.actualizarUsuario, async (req, res) => {
  const { nombre, email } = req.body;
  const usuarioId = req.usuario.id;

  try {
    // Verificar que el email no esté registrado por otro usuario
    if (email) {
      const [existing] = await pool.query(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, usuarioId]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    // Construir query dinámico
    let updateFields = [];
    let values = [];

    if (nombre) {
      updateFields.push('nombre = ?');
      values.push(nombre);
    }
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    values.push(usuarioId);

    const [result] = await pool.query(
      `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
});

/* 
  ========== RUTAS ADMIN - GESTIÓN DE USUARIOS ==========
*/

// GET /api/usuarios - Obtener todos los usuarios (con paginación y filtros) - SIN AUTENTICACIÓN (PRUEBA)
router.get('/', usuarioValidators.paginacion, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, nombre, email, rol, created_at FROM usuarios';
    let countQuery = 'SELECT COUNT(*) as total FROM usuarios';
    let params = [];

    // Filtro de búsqueda
    if (search) {
      query += ' WHERE nombre LIKE ? OR email LIKE ?';
      countQuery += ' WHERE nombre LIKE ? OR email LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    // Paginación
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const allParams = [...params, parseInt(limit), offset];

    const [usuarios] = await pool.query(query, allParams);
    const [countResult] = await pool.query(countQuery, params);

    // Siempre devolver un array y paginación válida
    res.json({
      message: 'Usuarios obtenidos correctamente',
      data: Array.isArray(usuarios) ? usuarios : [],
      paginacion: {
        total: countResult[0]?.total || 0,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: countResult[0]?.total ? Math.ceil(countResult[0].total / limit) : 1
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', authMiddleware, checkOwnerOrAdmin, usuarioValidators.idParam, async (req, res) => {
  try {
    const { id } = req.params;

    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      message: 'Usuario obtenido correctamente',
      data: usuarios[0]
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// POST /api/usuarios - Crear nuevo usuario (SOLO ADMIN)
router.post('/', authMiddleware, checkRole('admin'), usuarioValidators.crearUsuario, async (req, res) => {
  const { nombre, email, password, rol = 'usuario' } = req.body;

  try {
    // Verificar si el email ya existe
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json({
      message: 'Usuario creado correctamente',
      data: {
        id: result.insertId,
        nombre,
        email,
        rol
      }
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// PUT /api/usuarios/:id - Actualizar usuario (SOLO ADMIN)
router.put('/:id', authMiddleware, checkRole('admin'), usuarioValidators.idParam, usuarioValidators.actualizarUsuario, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  try {
    // Verificar que el usuario exista
    const [existing] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que el email no esté registrado por otro usuario
    if (email) {
      const [emailExists] = await pool.query(
        'SELECT id FROM usuarios WHERE email = ? AND id != ?',
        [email, id]
      );
      if (emailExists.length > 0) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    // Construir query dinámico
    let updateFields = [];
    let values = [];

    if (nombre) {
      updateFields.push('nombre = ?');
      values.push(nombre);
    }
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (rol) {
      updateFields.push('rol = ?');
      values.push(rol);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    values.push(id);

    const [result] = await pool.query(
      `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// DELETE /api/usuarios/:id - Eliminar usuario (SOLO ADMIN)
router.delete('/:id', authMiddleware, checkRole('admin'), usuarioValidators.idParam, async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que no sea la eliminación del mismo usuario
    if (req.usuario.id == id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta de este modo' });
    }

    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

module.exports = router;