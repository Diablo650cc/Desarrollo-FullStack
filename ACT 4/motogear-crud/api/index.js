require('dotenv').config();
const connectDB = require('../src/config/database');
const app = require('../src/app');

// Conectar a MongoDB
connectDB();

module.exports = app;
