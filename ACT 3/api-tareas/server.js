const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const PELICULAS_FILE = path.join(__dirname, 'peliculas.json');
const USERS_FILE = path.join(__dirname, 'usuarios.json');
const JWT_SECRET = process.env.JWT_SECRET || 'cambia_esta_clave_por_una_segura';

app.use(express.json());
app.use(express.static(__dirname));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

// MANEJO DE DATOS CON EL MODULO FS
// LAS FUNCIONES ABAJO REALIZAN LECTURA/ESCRITURA EN ARCHIVOS JSON

async function obtenerPeliculas() {
  try {
    const data = await fs.readFile(PELICULAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarPeliculas(peliculas) {
  await fs.writeFile(PELICULAS_FILE, JSON.stringify(peliculas, null, 2));
}

// IMPLEMENTACION DE AUTENTICACION Y SESIONES
// USO DE bcryptjs PARA HASH DE CONTRASEÑAS Y jsonwebtoken PARA TOKENS

// Usuarios (auth)
async function obtenerUsuarios() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function guardarUsuarios(usuarios) {
  await fs.writeFile(USERS_FILE, JSON.stringify(usuarios, null, 2));
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

// Rutas de autenticación
// Registro
app.post('/auth/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password son requeridos' });

    const usuarios = await obtenerUsuarios();
    if (usuarios.find(u => u.username === username)) {
      return res.status(409).json({ error: 'Usuario ya existe' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const nuevoUsuario = { id: Date.now().toString(), username, passwordHash, createdAt: new Date().toISOString() };
    usuarios.push(nuevoUsuario);
    await guardarUsuarios(usuarios);
    const { passwordHash: _, ...safeUser } = nuevoUsuario;
    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
});

// Login
app.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password son requeridos' });

    const usuarios = await obtenerUsuarios();
    const usuario = usuarios.find(u => u.username === username);
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    const match = bcrypt.compareSync(password, usuario.passwordHash);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario.id, username: usuario.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// GET - Obtener todas las películas
app.get('/peliculas', async (req, res, next) => {
  try {
    const peliculas = await obtenerPeliculas();
    res.json(peliculas);
  } catch (error) {
    next(error);
  }
});

// POST - Crear película
app.post('/peliculas', authenticateToken, async (req, res, next) => {
  try {
    const { titulo, calificacion, comentarios } = req.body;
    
    if (!titulo || !calificacion || !comentarios) {
      const error = new Error('Titulo, calificación y comentarios son requeridos');
      error.status = 400;
      throw error;
    }

    if (calificacion < 1 || calificacion > 10) {
      const error = new Error('La calificación debe estar entre 1 y 10');
      error.status = 400;
      throw error;
    }

    const peliculas = await obtenerPeliculas();
    const nuevaPelicula = {
      id: Date.now().toString(),
      titulo,
      calificacion: parseInt(calificacion),
      comentarios,
      createdAt: new Date().toISOString()
    };

    // RUTAS PARA LA API RESTFUL
    // LAS RUTAS A CONTINUACION EXPONEN LOS ENDPOINTS DE LA API (PELÍCULAS)

    
    peliculas.push(nuevaPelicula);
    await guardarPeliculas(peliculas);
    res.status(201).json(nuevaPelicula);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar película
app.put('/peliculas/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const peliculas = await obtenerPeliculas();
    const indice = peliculas.findIndex(p => p.id === id);
    
    if (indice === -1) {
      const error = new Error('Película no encontrada');
      error.status = 404;
      throw error;
    }

    peliculas[indice] = { 
      ...peliculas[indice], 
      ...req.body,
      calificacion: req.body.calificacion ? parseInt(req.body.calificacion) : peliculas[indice].calificacion,
      id: peliculas[indice].id,
      createdAt: peliculas[indice].createdAt
    };
    
    await guardarPeliculas(peliculas);
    res.json(peliculas[indice]);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar película
app.delete('/peliculas/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const peliculas = await obtenerPeliculas();
    const peliculasFiltradas = peliculas.filter(p => p.id !== id);
    
    if (peliculasFiltradas.length === peliculas.length) {
      const error = new Error('Película no encontrada');
      error.status = 404;
      throw error;
    }

    await guardarPeliculas(peliculasFiltradas);
    res.json({ message: 'Película eliminada' });
  } catch (error) {
    next(error);
  }
});

// MANEJO DE ERRORES Y DEBUGGING
// EL MIDDLEWARE SIGUIENTE CAPTURA ERRORES Y DEVUELVE CÓDIGO HTTP
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor de Películas en http://localhost:${PORT}`);
});