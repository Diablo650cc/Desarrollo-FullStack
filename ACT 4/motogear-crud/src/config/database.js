const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('📡 Conectando a MongoDB...');
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        console.error('💡 Verifica que:');
        console.error('   1. MongoDB está corriendo (mongod)');
        console.error('   2. MONGODB_URI en .env es correcto');
        console.error(`   3. Actual MONGODB_URI: ${process.env.MONGODB_URI}`);
        process.exit(1);
    }
};

module.exports = connectDB;