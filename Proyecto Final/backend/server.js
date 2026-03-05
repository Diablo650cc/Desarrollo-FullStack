require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

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

async function startServer() {
    try {
        await initDatabase();
        console.log('✅ Conectado a MySQL');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });

        server.on('error', (error) => {
            if (error?.code === 'EADDRINUSE') {
                console.error(`❌ El puerto ${PORT} ya está en uso. Cierra el proceso que lo ocupa o cambia PORT.`);
            } else {
                console.error('❌ Error iniciando servidor HTTP:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.code || error.message || error);
        process.exit(1);
    }
}

startServer();

module.exports = app;
