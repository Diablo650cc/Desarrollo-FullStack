# 🏍️ MotoGear CRUD - Guía Local

## 📋 Requisitos

- **Node.js** v14+ 
- **MongoDB** local o conexión a MongoDB Atlas
- **npm** o **yarn**

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env` en la raíz (copiar de `.env.example`):
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/motogear
JWT_SECRET=your-secret-key-for-testing
JWT_EXPIRE=7d
NODE_ENV=development
```

**Opciones para MONGODB_URI:**

**Opción A: MongoDB Local**
```
MONGODB_URI=mongodb://localhost:27017/motogear
```
Requiere tener MongoDB instalado y corriendo:
```bash
# Windows: usar MongoDB Compass o
mongod

# Linux/Mac:
brew services start mongodb-community
```

**Opción B: MongoDB Atlas (Cloud)**
```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/motogear?retryWrites=true&w=majority
```

### 3. Ejecutar servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

**Output esperado:**
```
MongoDB conectado: localhost:27017
Servidor corriendo en puerto 3000
```

---

## ✅ Verificar que funciona

### Health Check
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2026-02-25T10:30:45.123Z",
  "uptime": 5.234,
  "mongodb": "conectado"
}
```

### API de prueba
```bash
curl http://localhost:3000/
```

Respuesta:
```json
{
  "message": "API MotoGear funcionando"
}
```

---

## 🧪 Ejecutar Pruebas

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# Modo watch (auto-recarga)
npm run test:watch

# Solo controladores
npm run test:controllers

# Solo middlewares
npm run test:middlewares

# Solo rutas
npm run test:routes
```

---

## 📚 Estructura de Carpetas

```
motogear-crud/
├── server.js              # Punto de entrada
├── package.json           # Dependencias
├── .env                   # Variables de entorno (NO commitear)
├── .env.example           # Template de .env
│
├── src/
│   ├── app.js             # Configuración Express
│   ├── config/
│   │   └── database.js    # Conexión MongoDB
│   ├── controllers/       # Lógica de negocio
│   ├── middlewares/       # Middlewares (auth, etc)
│   ├── models/            # Modelos Mongoose
│   └── routes/            # Rutas API
│
├── public/
│   └── login.html         # Página login (estática)
│
├── jest.config.js         # Configuración tests
└── README.md              # Este archivo
```

---

## 🔐 Endpoints Disponibles

### Autenticación
```
POST   /api/auth/register       # Registrar usuario
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/profile        # Obtener perfil (requiere token)
```

### Productos
```
GET    /api/products            # Listar todos (público)
GET    /api/products/:id        # Obtener uno (público)
POST   /api/products            # Crear (requiere token)
PUT    /api/products/:id        # Actualizar (requiere token)
DELETE /api/products/:id        # Eliminar (requiere token)
```

### Sistema
```
GET    /                        # API status
GET    /health                  # Health check
```

---

## 🧪 Ejemplo: Probar con cURL

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Guardar token en variable
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Crear producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Casco",
    "categoria": "Cascos",
    "precio": 150,
    "talla": "M",
    "color": "Negro",
    "stock": 5
  }'
```

### 4. Listar productos
```bash
curl http://localhost:3000/api/products
```

### 5. Obtener producto por ID
```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439012
```

---

## 🛠️ Usar con Postman/Insomnia

1. **Descargar Postman:** https://www.postman.com/downloads/
2. **Importar endpoints:**
   - Variables de entorno: `{{BASE_URL}}` = `http://localhost:3000`
   - Crear carpeta "MotoGear"
   - Agregar requests para cada endpoint
   - Guardar token en variable global para uso en requests autenticados

---

## 🐛 Solución de Problemas

### Error: `MONGODB_URI is not defined`
✅ Solución: Crear `.env` y configurar `MONGODB_URI`

### Error: `Cannot connect to MongoDB`
✅ Soluciones posibles:
- Verificar que MongoDB está corriendo (`mongod`)
- Verificar que `MONGODB_URI` es correcto
- Si usas Atlas, verificar IP whitelist

### Error: `Port 3000 already in use`
✅ Solución: Cambiar `PORT` en `.env` (ej: `PORT=3001`)

### Tests fallan
✅ Solución: 
```bash
npm install
npm test
```

---

## 📝 Variables de Entorno

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `PORT` | 3000 | Puerto del servidor |
| `MONGODB_URI` | mongodb://localhost:27017/motogear | URL de MongoDB |
| `JWT_SECRET` | default-secret | Clave para firmar tokens JWT |
| `JWT_EXPIRE` | 7d | Expiración de tokens |
| `NODE_ENV` | development | Ambiente (development/production) |

---

## 🚦 Status Codes

| Código | Significado |
|--------|------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - Token requerido/inválido |
| `403` | Forbidden - Sin permisos |
| `404` | Not Found - Recurso no existe |
| `500` | Server Error - Error interno |

---

## 📚 Documentación Adicional

- [TESTING.md](TESTING.md) - Guía completa de pruebas
- [TESTING_SUMMARY.md](TESTING_SUMMARY.md) - Resumen de tests
- [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Checklist de tests
- [RESUMEN_PRUEBAS.md](RESUMEN_PRUEBAS.md) - Resumen rápido

---

## 🎓 Aprender más

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 📞 Soporte

Para issues o preguntas:
1. Revisar `.env` está configurado correctamente
2. Asegurar MongoDB está corriendo
3. Revisar logs en consola
4. Ejecutar tests: `npm test`

---

**Versión:** 1.0.0  
**Actualizado:** 25 Feb 2026  
**Estado:** ✅ Listo para usar
