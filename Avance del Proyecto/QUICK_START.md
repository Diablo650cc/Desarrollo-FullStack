# 🚀 GUÍA RÁPIDA DE INICIO

## Instalación Rápida (Windows)

### 1. Ejecuta el script de instalación
```bash
setup.bat
```

Este script automáticamente:
- ✅ Instala dependencias del backend
- ✅ Instala dependencias del frontend
- ✅ Crea archivo .env

### 2. Configura tu Base de Datos
Edita el archivo `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=proyecto_api
```

### 3. Inicia MySQL y crea la BD
```bash
mysql -u root -p < proyecto_api_v2.sql
```

### 4. Inicia los servidores

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Accede a la aplicación
- Backend: http://localhost:3000
- Frontend: http://localhost:4200

---

## Instalación Rápida (Linux/Mac)

### 1. Ejecuta el script de instalación
```bash
chmod +x setup.sh
./setup.sh
```

### 2-5. Sigue los mismos pasos que Windows

---

## Usuarios de Prueba

### Administrador
```
Email: admin@example.com
Contraseña: Admin@123
```

### Usuario Regular
```
Email: usuario@example.com
Contraseña: Usuario@123
```

---

## Características Implementadas ✨

### Backend
- ✅ JWT con roles (admin/usuario)
- ✅ Middleware de autorización
- ✅ Validación de datos
- ✅ Paginación en GET requests
- ✅ Filtros de búsqueda
- ✅ API de pagos (Stripe)
- ✅ API de tipos de cambio (dólar)

### Frontend
- ✅ Angular 17 moderno
- ✅ Componentes standalone
- ✅ Sistema de rutas
- ✅ Guards de autenticación
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Interfaz completa y profesional

---

## Estructura de Carpetas

```
Avance del Proyecto/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── angular.json
├── proyecto_api_v2.sql
├── README.md
└── setup.bat / setup.sh
```

---

## ¿Necesitas ayuda?

📖 Lee el [README.md](./README.md) para documentación completa
🛠 Revisa los archivos en la carpeta `frontend/src` para entender la estructura
💾 Consulta `proyecto_api_v2.sql` para entender la BD

---

**¡Disfruta construyendo tu aplicación Full Stack! 🎉**
