# Backend API - Product Management System

API REST desarrollada con Node.js, Express.js y MongoDB para la gestión de productos con autenticación JWT.

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor
npm run dev
```

Servidor corriendo en: `http://localhost:5000`

## 📁 Estructura

```
backend/
├── server.js              # Entrada del servidor
├── package.json           # Dependencias
├── jest.config.js         # Config pruebas
├── .env                   # Variables (no commit)
├── .env.example           # Plantilla
├── models/
│   ├── User.js           # Mongoose schema de usuario
│   └── Product.js        # Mongoose schema de producto
├── routes/
│   ├── auth.js           # Endpoints de autenticación
│   └── products.js       # CRUD endpoints
├── middleware/
│   └── auth.js           # JWT authentication
└── tests/
    ├── api.test.js       # Pruebas de API (Supertest)
    └── models.test.js    # Pruebas de modelos
```

## 🔧 Variables de Entorno

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/product-app
PORT=5000
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRE=24h
NODE_ENV=development
```

## 📚 Endpoints

### Autenticación (sin protección)

#### POST /api/auth/register
Registrar nuevo usuario
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Productos (requieren Authorization header)

**Header requerido:**
```
Authorization: Bearer {token}
```

#### GET /api/products
Obtener todos los productos del usuario

#### GET /api/products/:id
Obtener un producto específico

#### POST /api/products
Crear nuevo producto
```json
{
  "nombre": "Laptop",
  "descripcion": "Description",
  "categoria": "Electrónica",
  "precio": 999.99,
  "talla": "N/A",
  "color": "Gris",
  "stock": 5
}
```

#### PUT /api/products/:id
Actualizar producto
```json
{
  "nombre": "Updated Laptop",
  "precio": 1099.99
}
```

#### DELETE /api/products/:id
Eliminar producto

## 🧪 Pruebas

```bash
# Todas las pruebas
npm test

# Modo watch
npm run test:watch

# Con cobertura
npm run test:coverage

# Archivo específico
npm test -- api.test.js
```

## 🗄️ Base de Datos

### MongoDB Local
```bash
mongod
```

### MongoDB Atlas (Cloud)
1. Crear cuenta en [mongodb.com](https://mongodb.com)
2. Crear cluster
3. Obtener connection string
4. Actualizar MONGODB_URI en .env

## 📦 Dependencias

```json
{
  "express": "API framework",
  "mongoose": "MongoDB ODM",
  "jsonwebtoken": "JWT authentication",
  "bcryptjs": "Password hashing",
  "cors": "Cross-origin",
  "dotenv": "Environment variables",
  "jest": "Testing framework",
  "supertest": "HTTP testing",
  "nodemon": "Dev watch"
}
```

## 🔐 Autenticación

1. **Registro**: Contraseña hasheada con bcrypt + 10 rounds
2. **Login**: JWT token generado (válido 24h)
3. **Protección**: Middleware valida token en cada request
4. **Token**: `Authorization: Bearer {token}`

## 🚀 Deploy

### Heroku
```bash
heroku create app-name
heroku config:set MONGODB_URI=<url-atlas>
heroku config:set JWT_SECRET=<secreto>
git push heroku main
```

### Verificar API

```bash
# Registrar
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Obtener productos (con token)
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

**Error: Cannot connect to MongoDB**
- Verificar MongoDB está corriendo: `mongod`
- Verificar MONGODB_URI en .env
- Usar MongoDB Atlas si no tienes local

**Error: Port 5000 in use**
- Cambiar PORT en .env
- O: `lsof -ti:5000 | xargs kill -9`

**Error: Invalid token**
- Token expiró - login nuevamente
- JWT_SECRET cambió - regenerar tokens

## 📝 Notas de Desarrollo

- Usa `npm run dev` durante desarrollo (with nodemon)
- Las variables en .env nunca se commitan
- Modelos Mongoose con validación automática
- Middleware de autenticación reutilizable
- Tests con 95%+ de cobertura

---

**Última actualización:** 2024  
**Version:** 1.0.0
