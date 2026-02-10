require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta base (prueba rápida)
app.get('/', (req, res) => {
  res.json({ mensaje: 'API REST funcionando correctamente' });
});

// Rutas API
const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Serviendo archivos desde: ${path.join(__dirname, 'public')}`);
  console.log(`Login: http://localhost:${PORT}/login.html`);
  console.log(`Registro: http://localhost:${PORT}/registro.html`);
  console.log(`Dashboard: http://localhost:${PORT}/dashboard.html`);
});