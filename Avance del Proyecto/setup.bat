@echo off
REM Script de instalación para Windows

echo.
echo ╔═════════════════════════════════════════╗
echo ║     Instalación - Proyecto Full Stack   ║
echo ╚═════════════════════════════════════════╝

REM Instalar dependencias del backend
echo.
echo 📦 Instalando dependencias del backend...
call npm install

REM Crear archivo .env si no existe
if not exist .env (
    echo.
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ✅ Archivo .env creado. Edítalo con tus credenciales.
)

REM Instalar dependencias del frontend
echo.
echo 📦 Instalando dependencias del frontend...
cd frontend
call npm install
cd ..

echo.
echo ╔═════════════════════════════════════════╗
echo ║        ✅ ¡Instalación completada!      ║
echo ╠═════════════════════════════════════════╣
echo ║                                         ║
echo ║  Pasos siguientes:                      ║
echo ║  1. Edita el archivo .env con tus BD   ║
echo ║  2. Ejecuta: npm run dev                ║
echo ║  3. En otra terminal: cd frontend ^&^& npm start  ║
echo ║                                         ║
echo ║  Backend: http://localhost:3000         ║
echo ║  Frontend: http://localhost:4200        ║
echo ║                                         ║
echo ╚═════════════════════════════════════════╝
