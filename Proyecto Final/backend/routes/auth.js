const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { getPool } = require('../db');
const { AppError } = require('../middleware/error');
const { validate, validateAuthPayload } = require('../middleware/validate');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', validate(validateAuthPayload), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const pool = getPool();

        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existingUsers.length > 0) {
            return next(new AppError('El usuario ya existe', 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [insertResult] = await pool.query(
            'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
            [email, hashedPassword, 'user']
        );

        const userId = insertResult.insertId;

        const token = generateToken(String(userId), email, 'user');

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user: { id: String(userId), email, role: 'user' }
        });
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', validate(validateAuthPayload), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const pool = getPool();

        const [users] = await pool.query(
            'SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (users.length === 0) {
            return next(new AppError('Credenciales invalidas', 401));
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new AppError('Credenciales invalidas', 401));
        }

        const token = generateToken(String(user.id), user.email, user.role);

        res.json({
            message: 'Sesión iniciada correctamente',
            token,
            user: { id: String(user.id), email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;

