const jwt = require('jsonwebtoken');
const { AppError } = require('./error');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Middleware para proteger rutas
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new AppError('Token no proporcionado', 401));
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        next();
    } catch (err) {
        return next(new AppError('Token invalido o expirado', 401));
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('No autenticado', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('No tienes permisos para esta accion', 403));
        }

        return next();
    };
};

// Generar token
const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

module.exports = { authMiddleware, authorizeRoles, generateToken, JWT_SECRET };
