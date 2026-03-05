const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { getPool } = require('../db');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = getPool();

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        const [insertResult] = await pool.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const userId = insertResult.insertId;

        const token = generateToken(String(userId), email);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user: { id: String(userId), email }
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const pool = getPool();

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        const [users] = await pool.query(
            'SELECT id, email, password FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(String(user.id), user.email);

        res.json({
            message: 'Sesión iniciada correctamente',
            token,
            user: { id: String(user.id), email: user.email }
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;

