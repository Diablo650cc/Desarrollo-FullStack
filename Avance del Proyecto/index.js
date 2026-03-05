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

// Rutas API
const usuariosRoutes = require('./routes/usuarios.routes');
const pagosRoutes = require('./routes/pagos.routes');
const externalRoutes = require('./routes/external.routes');

// Ruta base (prueba rápida)
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API REST funcionando correctamente',
    version: '2.0',
    endpoints: {
      usuarios: '/api/usuarios',
      pagos: '/api/pagos',
      external: '/api/external'
    }
  });
});

// Registrar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/external', externalRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      Servidor corriendo en puerto ${PORT}    ║
║     http://localhost:${PORT}             ║
╚════════════════════════════════════════╝
  `);
  console.log('Rutas disponibles:');
  console.log(`  • POST   /api/usuarios/registro`);
  console.log(`  • POST   /api/usuarios/login`);
  console.log(`  • GET    /api/usuarios/perfil`);
  console.log(`  • PUT    /api/usuarios/perfil`);
  console.log(`  • GET    /api/usuarios (admin)`);
  console.log(`  • GET    /api/usuarios/:id`);
  console.log(`  • POST   /api/usuarios (admin)`);
  console.log(`  • PUT    /api/usuarios/:id (admin)`);
  console.log(`  • DELETE /api/usuarios/:id (admin)`);
  console.log(`  • POST   /api/pagos/procesar`);
  console.log(`  • GET    /api/pagos`);
  console.log(`  • GET    /api/pagos/:id`);
  console.log(`  • GET    /api/external/dolar`);
  console.log(`  • GET    /api/external/dolar/convertir?cantidad=100&towards=ARS`);
});
