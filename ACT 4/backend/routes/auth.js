const express = require('express');
const router = express.Router();
const { generateToken } = require('../middleware/auth');
const { mockUsers } = require('../mock-data');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario (DEMO MODE)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Verificar si el usuario ya existe
        let user = mockUsers.find(u => u.email === email);
        if (user) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario simulado
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {
            id: Date.now().toString(),
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        
        mockUsers.push(user);

        const token = generateToken(user.id, user.email);

        res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión (DEMO MODE)
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Verificar usuario
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user.id, user.email);

        res.json({
            message: 'Sesión iniciada correctamente',
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;

