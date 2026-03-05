require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a MongoDB (Comentado para demo sin BD)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/motogear';

// mongoose.connect(MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('✅ Conectado a MongoDB'))
// .catch(err => console.error('❌ Error conectando a MongoDB:', err));

console.log('⚠️  MODO DEMO: Sin MongoDB - Datos en memoria');

// Rutas de API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Rutas del frontend
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/products.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/products.html'));
});

app.get('/login', (req, res) => {
    res.redirect('/login.html');
});

app.get('/register', (req, res) => {
    res.redirect('/register.html');
});

app.get('/products', (req, res) => {
    res.redirect('/products.html');
});

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// 404
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;
