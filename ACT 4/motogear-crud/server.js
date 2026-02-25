require('dotenv').config();
const connectDB = require('./src/config/database');
const app = require('./src/app');

// Validar variables de entorno requeridas
const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.error(`❌ Error: Variables de entorno faltantes: ${missingVars.join(', ')}`);
    console.error('📝 Crear archivo .env con:');
    console.error('   MONGODB_URI=mongodb://localhost:27017/motogear');
    console.error('   JWT_SECRET=your-secret-key');
    process.exit(1);
}

// Conectar a MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`\n✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health\n`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT recibido, cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado');
        process.exit(0);
    });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rechazada sin manejar:', reason);
    process.exit(1);
});