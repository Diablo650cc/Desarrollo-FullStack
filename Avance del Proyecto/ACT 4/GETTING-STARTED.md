# 🚀 GETTING STARTED - Guía de Inicio Rápido

## ⚡ 5 Pasos para Empezar

### 1️⃣ Navega a la carpeta backend
```bash
cd "ACT 4\backend"
```

### 2️⃣ Instala las dependencias
```bash
npm install
```

### 3️⃣ Copia el archivo .env
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 4️⃣ Inicia MongoDB (en otra terminal)
```bash
mongod
```

### 5️⃣ Inicia el servidor
```bash
npm run dev
```

## ✅ Listo!

Abre tu navegador en: **http://localhost:5000**

Te redirigirá automáticamente a la página de login.

## 📚 Acciones Disponibles

### Crear Nueva Cuenta
1. Click en "Registrarse" en login.html
2. Ingresa email y contraseña
3. Serás redirigido a login

### Iniciar Sesión
1. Ingresa email y contraseña
2. Serás redirigido al dashboard

### Dashboard - Gestionar Productos
- ➕ **Agregar**: Click en botón "Agregar Producto"
- ✏️ **Editar**: Click en ícono de editar en el producto
- 🗑️ **Eliminar**: Click en ícono de eliminar
- 🔍 **Filtrar**: Click en categorías
- 📊 **Ver estadísticas**: Panel superior

### Cerrar Sesión
- Click botón "Logout" en navbar

## 📁 Tu Estructura

```
ACT 4/
├── frontend/          ← Interfaz web (HTML/CSS/JS)
├── backend/           ← API y base de datos (Node/Express)
│   ├── models/        ← Esquemas de MongoDB
│   ├── routes/        ← Endpoints API
│   ├── middleware/    ← Autenticación JWT
│   ├── tests/         ← Pruebas unitarias
│   ├── .env           ← CONFIGURACIÓN (NO COMPARTIR)
│   └── server.js      ← Punto de entrada
└── README.md          ← Documentación completa
```

## 🧪 Ejecutar Pruebas

```bash
cd backend
npm test
```

## 🚨 Problemas Comunes

### ❌ Error: "Cannot connect to MongoDB"
✅ Solución: Asegúrate que MongoDB está corriendo
```bash
mongod
```

### ❌ Error: "Port 5000 already in use"
✅ Solución: Cambia el puerto en `backend/.env`
```
PORT=3000  # u otro puerto
```

### ❌ Error: "Cannot find module"
✅ Solución: Instala las dependencias
```bash
cd backend
npm install
```

### ❌ Error: "Invalid token"
✅ Solución: Limpia localStorage y haz login de nuevo
```javascript
// En consola del navegador:
localStorage.clear()
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Productos (con token)
- `GET /api/products` - Obtener todos
- `POST /api/products` - Crear
- `PUT /api/products/:id` - Actualizar
- `DELETE /api/products/:id` - Eliminar

## 💾 Variables de Entorno (.env)

```
MONGODB_URI=mongodb://localhost:27017/product-app
PORT=5000
JWT_SECRET=tu_clave_secreta_aqui
JWT_EXPIRE=24h
NODE_ENV=development
```

## 🛠️ Tecnologías

| Stack | Tecnología |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT + Bcrypt |
| Testing | Jest + Supertest |

## 📖 Documentación Completa

Consulta estos archivos para más detalles:
- `README.md` - Documentación general
- `backend/README.md` - Guía del backend
- `frontend/README.md` - Guía del frontend
- `MIGRATION_COMPLETE.md` - Detalles de la migración
- `API-TESTING.md` - Testing de endpoints

## 🎓 Aprende

### Crear un usuario de prueba
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Crear un producto
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre":"Laptop",
    "categoria":"Electrónica",
    "precio":999.99,
    "stock":5
  }'
```

## ✨ Features

✅ Autenticación JWT  
✅ CRUD Completo  
✅ Dashboard moderno  
✅ Tema oscuro  
✅ Responsive  
✅ Pruebas automatizadas  
✅ Base de datos MongoDB  
✅ Contraseñas encriptadas  

## 🎯 Próximo Paso

1. Asegúrate MongoDB esté corriendo
2. Ejecuta `npm run dev` en backend/
3. Abre http://localhost:5000
4. ¡Disfruta tu app! 🎉

---

**¿Preguntas?** Revisa los README en cada carpeta.
