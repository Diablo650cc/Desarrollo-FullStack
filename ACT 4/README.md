# Aplicación de Gestión de Productos

Sistema completo de gestión de productos con autenticación JWT, CRUD completo, pruebas unitarias y arquitectura frontend/backend.

## 🚀 Características

- ✅ **Autenticación JWT**: Registro e inicio de sesión seguros
- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- ✅ **MongoDB**: Base de datos NoSQL para persistencia
- ✅ **API REST**: Backend con Express.js
- ✅ **Interfaz Moderna**: Diseño responsive con tema oscuro
- ✅ **Pruebas Unitarias**: Jest + Supertest para testing
- ✅ **Gestión de Inventario**: Control de stock y categorías
- ✅ **Arquitectura Escalable**: Separación frontend/backend

## 📋 Requisitos Previos

- Node.js v14 o superior
- MongoDB (local o Atlas)
- npm o yarn
- Navegador web moderno

## 🔧 Instalación Rápida

### 1. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus valores
```

### 2. Configurar .env
```bash
MONGODB_URI=mongodb://localhost:27017/product-app
PORT=5000
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=24h
NODE_ENV=development
```

### 3. Iniciar MongoDB
```bash
mongod
```

### 4. Iniciar Servidor
```bash
cd backend
npm run dev          # Desarrollo con watch
# o
npm start            # Producción
```

El servidor estará disponible en `http://localhost:5000`

## 📁 Estructura del Proyecto

```
ACT 4/
│
├── frontend/                 # Aplicación web (HTML/CSS/JS)
│   ├── login.html           # Página de inicio de sesión
│   ├── register.html        # Página de registro
│   └── products.html        # Dashboard de gestión (⭐ NUEVO)
│
├── backend/                  # API REST
│   ├── server.js            # Entrada del servidor
│   ├── package.json         # Dependencias
│   ├── jest.config.js       # Configuración de pruebas
│   ├── .env                 # Variables (no commit)
│   ├── .env.example         # Plantilla
│   ├── .gitignore           # Archivos ignorados
│   │
│   ├── models/
│   │   ├── User.js          # Esquema de usuario
│   │   └── Product.js       # Esquema de producto
│   │
│   ├── routes/
│   │   ├── auth.js          # /register, /login
│   │   └── products.js      # CRUD de productos
│   │
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   │
│   └── tests/
│       ├── api.test.js      # Pruebas de endpoints
│       └── models.test.js   # Pruebas de esquemas
│
└── README.md                # Este archivo
```

## 🌐 Endpoints de la API

### Autenticación (Público)
```
POST /api/auth/register     # Registrar usuario
POST /api/auth/login        # Iniciar sesión
```

### Productos (Requieren Token JWT)
```
GET    /api/products        # Obtener todos
GET    /api/products/:id    # Obtener uno
POST   /api/products        # Crear
PUT    /api/products/:id    # Actualizar
DELETE /api/products/:id    # Eliminar
```

## 🧪 Pruebas

```bash
cd backend

# Ejecutar todas las pruebas
npm test

# Modo watch
npm run test:watch

# Pruebas específicas
npm test -- api.test.js
npm test -- models.test.js

# Con cobertura
npm run test:coverage
```

### Pruebas Incluidas
- ✅ Registro de usuarios
- ✅ Login y validación
- ✅ CRUD de productos
- ✅ Autenticación JWT
- ✅ Validación de modelos
- ✅ Bcrypt password hashing

## 📊 Ejemplos de API

### Registrar Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "message": "Usuario registrado correctamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "usuario@example.com"
  }
}
```

### Crear Producto
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop",
    "descripcion": "High-performance laptop",
    "categoria": "Electrónica",
    "precio": 999.99,
    "color": "Gris",
    "stock": 5
  }'
```

## 📄 Modelos de Datos

### Usuario
```javascript
{
  _id: ObjectId,
  email: String (único),
  password: String (hasheado con bcrypt),
  createdAt: Date
}
```

### Producto
```javascript
{
  _id: ObjectId,
  nombre: String,
  descripcion: String,
  categoria: String,
  precio: Number,
  talla: String,
  color: String,
  stock: Number,
  usuario: ObjectId (referencia a User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Flujo de Autenticación

1. **Registro**: Email + Contraseña → Bcrypt Hash → MongoDB
2. **Login**: Email + Contraseña → Comparación → JWT Token
3. **Protección**: Token enviado en Header `Authorization: Bearer {token}`
4. **Validación**: Middleware verifica y decodifica JWT
5. **Expiración**: Token válido por 24 horas

## 🎨 Interfaz de Usuario

### Páginas Disponibles
- **login.html** - Página de autenticación
- **register.html** - Registro de nuevos usuarios
- **products.html** - Dashboard completo

### Características de products.html
- 📊 Panel de estadísticas en tiempo real
- 📦 Tabla de productos filtrable
- ➕ Modal para crear/editar productos
- 🔍 Filtros por categoría
- 📱 Diseño completamente responsive
- 🎨 Tema oscuro moderno

## 🚀 Despliegue

### Desplegar en Heroku
```bash
# 1. Crear app
heroku create nombre-app

# 2. Configurar MongoDB Atlas
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# 3. Desplegar
git push heroku main
```

### Variables Requeridas en Producción
- `PORT` (Heroku lo provee)
- `MONGODB_URI` (Atlas)
- `JWT_SECRET` (clave segura)
- `NODE_ENV=production`

## 📚 Stack Técnico

### Frontend
- HTML5 Semántico
- CSS3 (Grid, Flexbox)
- JavaScript ES6+
- Fetch API

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM
- **JWT** - Autenticación
- **Bcryptjs** - Hashing
- **Jest** - Testing
- **Supertest** - Test API
- **Dotenv** - Configuración

## 🐛 Solucionar Problemas

### Error: "Cannot connect to MongoDB"
```bash
# Verificar MongoDB está corriendo
mongod

# O usar MongoDB Atlas (cambiar MONGODB_URI en .env)
```

### Error: "Port 5000 already in use"
```bash
# Cambiar PORT en .env
# O terminar proceso
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000 | xargs kill -9
```

### Error: "Invalid token"
- Limpiar localStorage
- Hacer login nuevamente
- Token expiró (24 horas)

### Las pruebas fallan
```bash
# Instalar dependencias globales si es necesario
npm install -g jest

# Limpiar caché
npm cache clean --force

# Reinstalar
rm -rf node_modules
npm install
npm test
```

## 📝 Scripts Disponibles

```bash
npm start              # Iniciar en producción
npm run dev            # Iniciar con watch (nodemon)
npm test               # Ejecutar pruebas
npm run test:watch    # Pruebas en modo watch
npm run test:coverage # Pruebas con cobertura
```

## 📖 Documentación Adicional

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Jest Docs](https://jestjs.io/)

## 👥 Colaboradores

- Desarrollo full-stack completo
- Arquitectura escalable
- Mejores prácticas implementadas

## 📄 Licencia

Proyecto educativo - Libre para uso personal

## 📞 Soporte

Para problemas o sugerencias, crear un issue en el repositorio.

---

**Última actualización:** 2024  
**Versión:** 1.0.0
