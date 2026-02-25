const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, token requerido' });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Obtener usuario del token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Middleware para verificar propiedad del producto
const checkProductOwner = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // permitir al propietario o a un administrador
        if (
            product.usuario.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este producto' });
        }

        req.product = product;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verificando propietario' });
    }
};

// middleware para rutas sólo accesibles por administradores
const admin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Se requiere rol de administrador' });
    }
    next();
};

module.exports = { protect, checkProductOwner, admin };