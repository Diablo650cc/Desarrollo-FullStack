#!/bin/bash

# Script de instalación y configuración del proyecto

echo "╔═════════════════════════════════════════╗"
echo "║     Instalación - Proyecto Full Stack   ║"
echo "╚═════════════════════════════════════════╝"

# Instalar dependencias del backend
echo ""
echo "📦 Instalando dependencias del backend..."
npm install

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Edítalo con tus credenciales."
fi

# Instalar dependencias del frontend
echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo ""
echo "╔═════════════════════════════════════════╗"
echo "║        ✅ ¡Instalación completada!      ║"
echo "╠═════════════════════════════════════════╣"
echo "║                                         ║"
echo "║  Pasos siguientes:                      ║"
echo "║  1. Edita el archivo .env con tus BD   ║"
echo "║  2. Ejecuta: npm run dev                ║"
echo "║  3. En otra terminal: cd frontend && npm start  ║"
echo "║                                         ║"
echo "║  Backend: http://localhost:3000         ║"
echo "║  Frontend: http://localhost:4200        ║"
echo "║                                         ║"
echo "╚═════════════════════════════════════════╝"
