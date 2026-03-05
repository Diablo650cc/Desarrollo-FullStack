# 📁 Estructura Completa del Proyecto

```
ACT 4/
│
├── 📄 HTML Files (Frontend)
│   ├── login.html ..................... Página de login
│   ├── register.html .................. Página de registro
│   └── products.html ⭐ ............... Página de gestión de productos (NUEVO)
│
├── 🚀 Backend & Server
│   ├── server.js ...................... Servidor Express principal
│   ├── package.json ................... Dependencias del proyecto
│   └── jest.config.js ................. Configuración de Jest
│
├── 🗂️ models/ .......................... Modelos de MongoDB
│   ├── User.js ........................ Esquema de usuario
│   └── Product.js ..................... Esquema de producto
│
├── 🛣️ routes/ .......................... Rutas de API
│   ├── auth.js ........................ Endpoints de autenticación
│   └── products.js .................... Endpoints CRUD de productos
│
├── 🔐 middleware/ ..................... Middlewares
│   └── auth.js ........................ Middleware de JWT
│
├── 🧪 tests/ .......................... Pruebas unitarias
│   ├── api.test.js .................... Pruebas de API
│   └── models.test.js ................. Pruebas de modelos
│
├── ⚙️ Configuration Files
│   ├── .env ........................... Variables de entorno
│   ├── .env.example ................... Ejemplo de .env
│   └── .gitignore ..................... Archivos a ignorar en git
│
└── 📚 Documentation
    ├── README.md ...................... Documentación principal
    ├── QUICKSTART.md .................. Guía de inicio rápido
    ├── INSTALLATION.md ................ Instalación detallada
    ├── API-TESTING.md ................. Ejemplos de pruebas
    ├── PROJECT-SUMMARY.md ............. Resumen del proyecto
    ├── test-api.sh .................... Script de pruebas
    └── ESTRUCTURA.md .................. Este archivo
```

## 📋 Descripción Detallada de Archivos

### 🎨 Frontend HTML

#### login.html
```
Función: Autenticación de usuarios e integración de gestión de productos
├── Form de login
├── Form de productos
├── Tabla de productos
├── Botones de editar/eliminar
└── Scripts de autenticación JWT
```

#### register.html
```
Función: Registro de nuevos usuarios
├── Form de registro
├── Validaciones
└── Redirección a login
```

#### products.html ⭐ NUEVO
```
Función: Interfaz moderna de gestión de productos
├── Navbar con info del usuario
├── Dashboard de estadísticas
├── Formulario de creación/edición
├── Lista de productos con filtros
├── Tabs de categorización
└── Sistema de notificaciones
```

### 🚀 Backend

#### server.js
```javascript
Función: Servidor Express principal
├── Configuración de middleware
├── Conexión a MongoDB
├── Rutas de API
├── Servicio de archivos estáticos HTML
└── Manejo de errores global
```

#### package.json
```json
Función: Gestión de dependencias
├── Dependencias de producción
│   ├── express
│   ├── mongoose
│   ├── jsonwebtoken
│   ├── bcryptjs
│   ├── cors
│   └── dotenv
├── Dependencias de desarrollo
│   ├── nodemon
│   ├── jest
│   └── supertest
└── Scripts de npm
    ├── start
    ├── dev
    ├── test
    └── test:watch
```

### 🗂️ Models

#### models/User.js
```javascript
Esquema:
├── email (String, unique, required)
├── password (String, required, hashed)
├── createdAt (Date, auto)

Métodos:
└── matchPassword(password) - Validar contraseña
```

#### models/Product.js
```javascript
Esquema:
├── nombre (String, required)
├── descripcion (String)
├── categoria (String, enum, required)
├── precio (Number, required, min: 0)
├── talla (String)
├── color (String)
├── stock (Number, default: 0)
├── usuario (ObjectId, ref: User)
├── createdAt (Date, auto)
└── updatedAt (Date, auto)

Validaciones:
├── Categorías válidas
├── Precio positivo
└── Stock no negativo
```

### 🛣️ Routes

#### routes/auth.js
```
Endpoints:
├── POST /api/auth/register
│   ├── Entrada: email, password
│   ├── Valida: email único, password 6+ chars
│   └── Retorna: token, usuario
│
└── POST /api/auth/login
    ├── Entrada: email, password
    ├── Valida: credenciales correctas
    └── Retorna: token, usuario
```

#### routes/products.js
```
Endpoints (Todos requieren autenticación):
├── GET /api/products
│   └── Retorna: Lista de productos del usuario
├── GET /api/products/:id
│   ├── Parámetro: product id
│   └── Retorna: Producto específico
├── POST /api/products
│   ├── Entrada: datos del producto
│   └── Crea: nuevo producto
├── PUT /api/products/:id
│   ├── Entrada: datos a actualizar
│   └── Actualiza: producto existente
└── DELETE /api/products/:id
    └── Elimina: producto específico
```

### 🔐 Middleware

#### middleware/auth.js
```javascript
Funciones:
├── authMiddleware(req, res, next)
│   ├── Extrae token del header
│   ├── Valida token JWT
│   └── Autoriza o rechaza
├── generateToken(id, email)
│   └── Genera JWT con 24h validez
└── JWT_SECRET - Constante de configuración
```

### 🧪 Tests

#### tests/api.test.js
```javascript
Describe Blocks:
├── Auth Routes
│   ├── Registro exitoso
│   ├── Registro sin email
│   ├── Email duplicado
│   ├── Login exitoso
│   ├── Login contraseña incorrecta
│   └── Usuario no existe
├── Product Routes (Crear)
│   ├── Crear producto con token
│   ├── Crear sin autenticación
│   └── Crear sin campos requeridos
├── Product Routes (Leer)
│   ├── Obtener todos los productos
│   └── Obtener sin autenticación
├── Product Routes (Actualizar)
│   ├── Actualizar producto
│   └── Sin autenticación
└── Product Routes (Eliminar)
    ├── Eliminar producto
    └── Sin autenticación
```

#### tests/models.test.js
```javascript
Describe Blocks:
├── User Model
│   ├── Password Hashing
│   │   ├── Hash verificación
│   │   ├── Match de contraseña
│   │   └── Rechazo de contraseña incorrecta
│   └── Email Validation
│       ├── Emails válidos
│       └── Emails inválidos
└── Product Model
    ├── Validación de precio mínimo
    ├── Validación de stock mínimo
    └── Validación de categorías enum
```

### ⚙️ Configuration

#### .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/motogear
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

#### .gitignore
```
node_modules/
.env
.env.local
.env.*.local
*.log
dist/
build/
coverage/
.DS_Store
```

### 📚 Documentation

#### README.md
- Características principales
- Requisitos previos
- Instalación
- Rutas de API
- Modelos de datos
- Búsqueda de problemas
- Despliegue

#### QUICKSTART.md
- Instalación rápida (5 pasos)
- Configuración de MongoDB
- Iniciar aplicación
- Acceso a la app
- Problemas comunes

#### INSTALLATION.md
- Requisitos detallados
- Instalación de Node.js
- Instalación de MongoDB
- Configuración paso a paso
- Verificación de instalación
- Checklist

#### API-TESTING.md
- Ejemplos de cURL
- Importación en Postman
- Variables de Postman
- Errores comunes
- Categorías válidas
- Flujo de prueba

## 🔄 Flujos de Datos

### Flujo de Autenticación
```
Usuario → login.html
     ↓
Form Submit → fetch POST /api/auth/login
     ↓
auth.js procesa email + password
     ↓
User.findOne() busca en MongoDB
     ↓
bcrypt.compare() valida contraseña
     ↓
generateToken() crea JWT
     ↓
Token → localStorage
     ↓
Redirecciona a products.html
```

### Flujo de CRUD
```
Usuario → products.html
     ↓
Rellenar formulario
     ↓
Submit → fetch POST /api/products
     ↓
authMiddleware valida JWT
     ↓
En authorize, procesa datos
     ↓
Mongoose valida schema
     ↓
MongoDB crea/actualiza/elimina
     ↓
Retorna resultado
     ↓
Frontend actualiza UI
```

## 💾 Base de Datos

### Estructura MongoDB

```
motogear (Database)
├── users (Collection)
│   ├── _id: ObjectId
│   ├── email: "usuario@example.com"
│   ├── password: (hasheada)
│   └── createdAt: ISODate
│
└── products (Collection)
    ├── _id: ObjectId
    ├── nombre: "Casco"
    ├── categoria: "Cascos"
    ├── precio: 150.99
    ├── stock: 10
    ├── usuario: ObjectId (ref)
    ├── createdAt: ISODate
    └── updatedAt: ISODate
```

## 📦 Dependencias

### Producción
| Paquete | Versión | Uso |
|---------|---------|-----|
| express | 4.18.2 | Framework web |
| mongoose | 7.8.0 | MongoDB ODM |
| jsonwebtoken | 9.1.2 | JWT management |
| bcryptjs | 2.4.3 | Hash de contraseñas |
| cors | 2.8.5 | CORS middleware |
| dotenv | 16.3.1 | Variables de entorno |

### Desarrollo
| Paquete | Versión | Uso |
|---------|---------|-----|
| nodemon | 3.0.2 | Auto-reload |
| jest | 29.7.0 | Testing framework |
| supertest | 6.3.3 | API testing |

## 🎯 Casos de Uso Principales

### 1. Usuario Nuevo
```
1. Abre login.html
2. Haz clic en "Registrarse"
3. Rellena register.html
4. Contraseña se hashea
5. Se guarda en MongoDB
6. Redirecciona a login
```

### 2. Usuario Existente
```
1. Abre login.html
2. Ingresa credenciales
3. Se validan en MongoDB
4. Se genera JWT
5. Se redirige a products.html
6. Puede gestionar productos
```

### 3. Crear Producto
```
1. En products.html, rellena Form
2. Haz clic "Guardar"
3. POST a /api/products con JWT
4. Middleware valida token
5. Se crea en MongoDB
6. Se muestra en lista
```

### 4. Editar Producto
```
1. En products.html, haz clic ✏️
2. Form se rellena
3. Modifica datos
4. PUT a /api/products/:id con JWT
5. Se actualiza en MongoDB
6. Se refleja en UI
```

### 5. Eliminar Producto
```
1. En products.html, haz clic 🗑️
2. Confirma eliminación
3. DELETE a /api/products/:id con JWT
4. Se elimina de MongoDB
5. Se actualiza lista
```

## 🚀 Scripts Available

```bash
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo (con nodemon)
npm test            # Ejecutar pruebas
npm run test:watch  # Pruebas en modo watch
```

## ✅ Checklist de Características

- [x] Registro de usuarios
- [x] Login seguro
- [x] JWT token authentication
- [x] Crear productos
- [x] Leer productos
- [x] Actualizar productos
- [x] Eliminar productos
- [x] Base de datos MongoDB
- [x] Validaciones
- [x] Control de permisos
- [x] Pruebas unitarias
- [x] Documentación completa
- [x] Interfaz mejorada

---

**Total de archivos:** 19  
**Total de documentación:** 6 archivos  
**Locaciones de carpetas:** 4 (models, routes, middleware, tests)
