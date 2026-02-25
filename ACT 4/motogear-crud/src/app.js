const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Directorio público para archivos estáticos (login HTML, etc.)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Rutas API desactivadas - MongoDB no está conectado
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public/login.html');
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (err) {
        res.status(500).json({ message: 'Error cargando HTML', error: err.message });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: process.env.MONGODB_URI ? 'configurado' : 'no configurado'
    });
});

// Manejo de rutas no encontradas - servir login.html para todas las rutas
app.use((req, res) => {
    const filePath = path.join(__dirname, '../public/login.html');
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (err) {
        res.status(404).json({ message: 'Ruta no encontrada' });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;