const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const TAREAS_FILE = path.join(__dirname, 'tareas.json');

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

async function obtenerTareas() {
  try {
    const data = await fs.readFile(TAREAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function guardarTareas(tareas) {
  await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
}

// GET - Obtener todas las tareas
app.get('/tareas', async (req, res, next) => {
  try {
    const tareas = await obtenerTareas();
    res.json(tareas);
  } catch (error) {
    next(error);
  }
});

// POST - Crear tarea
app.post('/tareas', async (req, res, next) => {
  try {
    const { titulo, descripcion } = req.body;
    
    if (!titulo || !descripcion) {
      const error = new Error('Titulo y descripcion son requeridos');
      error.status = 400;
      throw error;
    }

    const tareas = await obtenerTareas();
    const nuevaTarea = {
      id: Date.now().toString(),
      titulo,
      descripcion,
      createdAt: new Date().toISOString()
    };
    
    tareas.push(nuevaTarea);
    await guardarTareas(tareas);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar tarea
app.put('/tareas/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tareas = await obtenerTareas();
    const indice = tareas.findIndex(t => t.id === id);
    
    if (indice === -1) {
      const error = new Error('Tarea no encontrada');
      error.status = 404;
      throw error;
    }

    tareas[indice] = { 
      ...tareas[indice], 
      ...req.body,
      id: tareas[indice].id,
      createdAt: tareas[indice].createdAt
    };
    
    await guardarTareas(tareas);
    res.json(tareas[indice]);
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar tarea
app.delete('/tareas/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const tareas = await obtenerTareas();
    const tareasFiltradas = tareas.filter(t => t.id !== id);
    
    if (tareasFiltradas.length === tareas.length) {
      const error = new Error('Tarea no encontrada');
      error.status = 404;
      throw error;
    }

    await guardarTareas(tareasFiltradas);
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    next(error);
  }
});

// Middleware de error
app.use((err, req, res) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});