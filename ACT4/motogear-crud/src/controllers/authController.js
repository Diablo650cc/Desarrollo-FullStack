const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Registrar usuario
// @route   POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Verificar si usuario existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear usuario
        const user = await User.create({ email, password });

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registrando usuario', error: error.message });
    }
};

// @desc    Login usuario
// @route   POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // Buscar usuario
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error iniciando sesión', error: error.message });
    }
};

// @desc    Obtener perfil
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
    res.json(req.user);
};

module.exports = { register, login, getProfile };