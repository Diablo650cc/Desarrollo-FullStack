const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta principal
app.get('/', (req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/login.html');
        if (fs.existsSync(htmlPath)) {
            const html = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        } else {
            res.status(200).json({ message: 'MotoGear API - Login en /login.html' });
        }
    } catch (err) {
        res.status(200).json({ message: 'MotoGear API', error: err.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all para servir login.html
app.use((req, res) => {
    try {
        const htmlPath = path.join(__dirname, '../public/login.html');
        if (fs.existsSync(htmlPath)) {
            const html = fs.readFileSync(htmlPath, 'utf8');
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(html);
        } else {
            res.status(404).json({ message: 'Ruta no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
});

module.exports = app;
