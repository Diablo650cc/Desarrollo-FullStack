require('dotenv').config();
const { initDatabase } = require('./db');
const app = require('./app');

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
